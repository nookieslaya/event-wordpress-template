<?php

/**
 * Theme setup.
 */

namespace App;

/**
 * Get Vite manifest as array.
 *
 * @return array<string, array<string, mixed>>
 */
function event_theme_get_manifest(): array
{
    static $manifest = null;

    if ($manifest !== null) {
        return $manifest;
    }

    $manifest_path = get_theme_file_path('public/build/manifest.json');
    if (! file_exists($manifest_path)) {
        $manifest = [];

        return $manifest;
    }

    $decoded = json_decode((string) file_get_contents($manifest_path), true);
    $manifest = is_array($decoded) ? $decoded : [];

    return $manifest;
}

/**
 * Resolve manifest file path for an entry.
 */
function event_theme_manifest_file(string $entry): string
{
    $manifest = event_theme_get_manifest();
    $file = $manifest[$entry]['file'] ?? '';

    return is_string($file) ? $file : '';
}

/**
 * Inject styles into the block editor.
 */
add_filter('block_editor_settings_all', function ($settings) {
    $editor_css = event_theme_manifest_file('resources/css/editor.css');
    if ($editor_css === '') {
        return $settings;
    }

    $settings['styles'][] = [
        'css' => "@import url('".esc_url(get_theme_file_uri('public/build/'.$editor_css))."')",
    ];

    return $settings;
});

/**
 * Enqueue frontend assets from manifest.
 */
add_action('wp_enqueue_scripts', function () {
    $app_css = event_theme_manifest_file('resources/css/app.css');
    if ($app_css !== '') {
        wp_enqueue_style(
            'event-theme-app',
            get_theme_file_uri('public/build/'.$app_css),
            [],
            null
        );
    }

    $app_js = event_theme_manifest_file('resources/js/app.js');
    if ($app_js !== '') {
        wp_enqueue_script(
            'event-theme-app',
            get_theme_file_uri('public/build/'.$app_js),
            [],
            null,
            true
        );
    }
});

/**
 * Enqueue block editor script.
 */
add_action('enqueue_block_editor_assets', function () {
    $editor_file = event_theme_manifest_file('resources/js/editor.js');
    if ($editor_file === '') {
        return;
    }

    $dependencies = [];
    $manifest = event_theme_get_manifest();
    $deps_file = $manifest['editor.deps.json']['file'] ?? null;
    if (is_string($deps_file) && $deps_file !== '') {
        $deps_path = get_theme_file_path('public/build/'.$deps_file);
        if (file_exists($deps_path)) {
            $decoded_deps = json_decode((string) file_get_contents($deps_path), true);
            if (is_array($decoded_deps)) {
                $dependencies = $decoded_deps;
            }
        }
    }

    $dependencies = array_values(array_filter(
        $dependencies,
        static fn ($dependency) => is_string($dependency) && wp_script_is($dependency, 'registered')
    ));

    wp_enqueue_script(
        'event-theme-editor',
        get_theme_file_uri('public/build/'.$editor_file),
        $dependencies,
        null,
        true
    );

    wp_script_add_data('event-theme-editor', 'type', 'module');
});

/**
 * Force module type for editor bundle (some optimizers strip script data).
 */
add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ($handle !== 'event-theme-editor') {
        return $tag;
    }

    return sprintf(
        '<script type="module" src="%s" id="%s-js"></script>',
        esc_url($src),
        esc_attr($handle)
    );
}, 10, 3);

/**
 * Use the generated theme.json file.
 */
add_filter('theme_file_path', function ($path, $file) {
    return $file === 'theme.json'
        ? public_path('build/assets/theme.json')
        : $path;
}, 10, 2);

/**
 * Register the initial theme setup.
 */
add_action('after_setup_theme', function () {
    remove_theme_support('block-templates');

    register_nav_menus([
        'primary_navigation' => __('Primary Navigation', 'sage'),
    ]);

    remove_theme_support('core-block-patterns');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');

    add_theme_support('html5', [
        'caption',
        'comment-form',
        'comment-list',
        'gallery',
        'search-form',
        'script',
        'style',
    ]);

    add_theme_support('customize-selective-refresh-widgets');
}, 20);

/**
 * Register the theme sidebars.
 */
add_action('widgets_init', function () {
    $config = [
        'before_widget' => '<section class="widget %1$s %2$s">',
        'after_widget' => '</section>',
        'before_title' => '<h3>',
        'after_title' => '</h3>',
    ];

    register_sidebar([
        'name' => __('Primary', 'sage'),
        'id' => 'sidebar-primary',
    ] + $config);

    register_sidebar([
        'name' => __('Footer', 'sage'),
        'id' => 'sidebar-footer',
    ] + $config);
});
