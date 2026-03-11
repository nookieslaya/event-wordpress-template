<?php

/**
 * Global theme settings.
 */

namespace App;

/**
 * Get global settings.
 */
function event_theme_get_global_settings(): array
{
    $defaults = [
        'logo_url' => '',
        'logo_alt' => '',
        'logo_text' => 'LUMINA EVENTS',
    ];

    $options = get_option('event_theme_global_settings', []);

    if (! is_array($options)) {
        $options = [];
    }

    return wp_parse_args($options, $defaults);
}

/**
 * Sanitize global settings payload.
 */
function event_theme_sanitize_global_settings($input): array
{
    $input = is_array($input) ? $input : [];

    return [
        'logo_url' => esc_url_raw($input['logo_url'] ?? ''),
        'logo_alt' => sanitize_text_field($input['logo_alt'] ?? ''),
        'logo_text' => sanitize_text_field($input['logo_text'] ?? 'LUMINA EVENTS'),
    ];
}

/**
 * Render global settings page.
 */
function event_theme_render_global_settings_page(): void
{
    ?>
    <div class="wrap">
      <h1><?php esc_html_e('Global Settings', 'sage'); ?></h1>
      <form method="post" action="options.php">
        <?php
        settings_fields('event_theme_global_settings_group');
        do_settings_sections('event-theme-global-settings');
        submit_button();
        ?>
      </form>
    </div>
    <?php
}

/**
 * Render text field.
 */
function event_theme_render_text_field(array $args): void
{
    $option_name = $args['option_name'] ?? '';
    $field_key = $args['field_key'] ?? '';
    $placeholder = $args['placeholder'] ?? '';
    $description = $args['description'] ?? '';

    $values = get_option($option_name, []);
    $value = is_array($values) ? ($values[$field_key] ?? '') : '';
    ?>
    <input
      type="text"
      id="<?php echo esc_attr($field_key); ?>"
      name="<?php echo esc_attr($option_name); ?>[<?php echo esc_attr($field_key); ?>]"
      value="<?php echo esc_attr((string) $value); ?>"
      class="regular-text"
      placeholder="<?php echo esc_attr($placeholder); ?>"
    />
    <?php if (! empty($description)) : ?>
      <p class="description"><?php echo esc_html($description); ?></p>
    <?php endif; ?>
    <?php
}

add_action('admin_menu', function () {
    add_menu_page(
        __('Global Settings', 'sage'),
        __('Global Settings', 'sage'),
        'manage_options',
        'event-theme-global-settings',
        __NAMESPACE__.'\\event_theme_render_global_settings_page',
        'dashicons-admin-generic',
        61
    );
});

add_action('admin_init', function () {
    register_setting(
        'event_theme_global_settings_group',
        'event_theme_global_settings',
        [
            'type' => 'array',
            'sanitize_callback' => __NAMESPACE__.'\\event_theme_sanitize_global_settings',
            'default' => [],
        ]
    );

    add_settings_section(
        'event_theme_branding_section',
        __('Branding', 'sage'),
        '__return_null',
        'event-theme-global-settings'
    );

    add_settings_field(
        'logo_url',
        __('Logo URL', 'sage'),
        __NAMESPACE__.'\\event_theme_render_text_field',
        'event-theme-global-settings',
        'event_theme_branding_section',
        [
            'option_name' => 'event_theme_global_settings',
            'field_key' => 'logo_url',
            'placeholder' => 'https://example.com/logo.svg',
            'description' => __('Logo image URL. Leave empty to use text logo.', 'sage'),
        ]
    );

    add_settings_field(
        'logo_alt',
        __('Logo alt text', 'sage'),
        __NAMESPACE__.'\\event_theme_render_text_field',
        'event-theme-global-settings',
        'event_theme_branding_section',
        [
            'option_name' => 'event_theme_global_settings',
            'field_key' => 'logo_alt',
            'placeholder' => __('Site logo', 'sage'),
            'description' => __('Used for accessibility when image logo is set.', 'sage'),
        ]
    );

    add_settings_field(
        'logo_text',
        __('Logo text fallback', 'sage'),
        __NAMESPACE__.'\\event_theme_render_text_field',
        'event-theme-global-settings',
        'event_theme_branding_section',
        [
            'option_name' => 'event_theme_global_settings',
            'field_key' => 'logo_text',
            'placeholder' => 'LUMINA EVENTS',
            'description' => __('Shown when Logo URL is empty.', 'sage'),
        ]
    );
});
