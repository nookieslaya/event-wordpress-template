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
        'footer_brand_name' => 'STAGE DYNAMICS',
        'footer_brand_description' => 'Creating unforgettable live experiences through innovative production design and cutting-edge technology.',
        'footer_social_links' => "facebook|https://facebook.com\ninstagram|https://instagram.com\ntwitter|https://x.com\nlinkedin|https://linkedin.com\nyoutube|https://youtube.com",
        'footer_quick_links' => "Home|#\nServices|#services\nEvents|#\nTechnology|#technology\nAbout|#about\nGallery|#gallery",
        'footer_services_links' => "Event Production|#\nStage Design|#\nLighting Design|#\nAudio Systems|#\nVisual Production|#\nFestival Production|#",
        'footer_contact_email' => 'hello@stagedynamics.com',
        'footer_contact_phone' => '+1 (555) 123-4567',
        'footer_contact_address_line1' => '1234 Creative Ave',
        'footer_contact_address_line2' => 'Los Angeles, CA 90028',
        'footer_copyright' => '© 2026 Stage Dynamics. All rights reserved.',
        'footer_bottom_links' => "Privacy Policy|#\nTerms of Service|#\nDesign System|#",
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
        'footer_brand_name' => sanitize_text_field($input['footer_brand_name'] ?? 'STAGE DYNAMICS'),
        'footer_brand_description' => sanitize_textarea_field($input['footer_brand_description'] ?? ''),
        'footer_social_links' => sanitize_textarea_field($input['footer_social_links'] ?? ''),
        'footer_quick_links' => sanitize_textarea_field($input['footer_quick_links'] ?? ''),
        'footer_services_links' => sanitize_textarea_field($input['footer_services_links'] ?? ''),
        'footer_contact_email' => sanitize_text_field($input['footer_contact_email'] ?? ''),
        'footer_contact_phone' => sanitize_text_field($input['footer_contact_phone'] ?? ''),
        'footer_contact_address_line1' => sanitize_text_field($input['footer_contact_address_line1'] ?? ''),
        'footer_contact_address_line2' => sanitize_text_field($input['footer_contact_address_line2'] ?? ''),
        'footer_copyright' => sanitize_text_field($input['footer_copyright'] ?? ''),
        'footer_bottom_links' => sanitize_textarea_field($input['footer_bottom_links'] ?? ''),
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

/**
 * Render textarea field.
 */
function event_theme_render_textarea_field(array $args): void
{
    $option_name = $args['option_name'] ?? '';
    $field_key = $args['field_key'] ?? '';
    $placeholder = $args['placeholder'] ?? '';
    $description = $args['description'] ?? '';
    $rows = (int) ($args['rows'] ?? 6);

    $values = get_option($option_name, []);
    $value = is_array($values) ? ($values[$field_key] ?? '') : '';
    ?>
    <textarea
      id="<?php echo esc_attr($field_key); ?>"
      name="<?php echo esc_attr($option_name); ?>[<?php echo esc_attr($field_key); ?>]"
      class="large-text code"
      rows="<?php echo esc_attr((string) max($rows, 3)); ?>"
      placeholder="<?php echo esc_attr($placeholder); ?>"
    ><?php echo esc_textarea((string) $value); ?></textarea>
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

    add_settings_section(
        'event_theme_footer_section',
        __('Footer', 'sage'),
        '__return_null',
        'event-theme-global-settings'
    );

    $footer_text_fields = [
        [
            'key' => 'footer_brand_name',
            'label' => __('Brand name', 'sage'),
            'placeholder' => 'STAGE DYNAMICS',
            'description' => __('Displayed in first footer column.', 'sage'),
        ],
        [
            'key' => 'footer_contact_email',
            'label' => __('Contact email', 'sage'),
            'placeholder' => 'hello@stagedynamics.com',
            'description' => '',
        ],
        [
            'key' => 'footer_contact_phone',
            'label' => __('Contact phone', 'sage'),
            'placeholder' => '+1 (555) 123-4567',
            'description' => '',
        ],
        [
            'key' => 'footer_contact_address_line1',
            'label' => __('Address line 1', 'sage'),
            'placeholder' => '1234 Creative Ave',
            'description' => '',
        ],
        [
            'key' => 'footer_contact_address_line2',
            'label' => __('Address line 2', 'sage'),
            'placeholder' => 'Los Angeles, CA 90028',
            'description' => '',
        ],
        [
            'key' => 'footer_copyright',
            'label' => __('Copyright text', 'sage'),
            'placeholder' => '© 2026 Stage Dynamics. All rights reserved.',
            'description' => '',
        ],
    ];

    foreach ($footer_text_fields as $field) {
        add_settings_field(
            $field['key'],
            $field['label'],
            __NAMESPACE__.'\\event_theme_render_text_field',
            'event-theme-global-settings',
            'event_theme_footer_section',
            [
                'option_name' => 'event_theme_global_settings',
                'field_key' => $field['key'],
                'placeholder' => $field['placeholder'],
                'description' => $field['description'],
            ]
        );
    }

    add_settings_field(
        'footer_brand_description',
        __('Brand description', 'sage'),
        __NAMESPACE__.'\\event_theme_render_textarea_field',
        'event-theme-global-settings',
        'event_theme_footer_section',
        [
            'option_name' => 'event_theme_global_settings',
            'field_key' => 'footer_brand_description',
            'rows' => 4,
            'placeholder' => __('Short brand description shown in footer.', 'sage'),
            'description' => '',
        ]
    );

    add_settings_field(
        'footer_social_links',
        __('Social links', 'sage'),
        __NAMESPACE__.'\\event_theme_render_textarea_field',
        'event-theme-global-settings',
        'event_theme_footer_section',
        [
            'option_name' => 'event_theme_global_settings',
            'field_key' => 'footer_social_links',
            'rows' => 6,
            'placeholder' => "facebook|https://facebook.com",
            'description' => __('One per line: platform|url (platform: facebook, instagram, twitter, linkedin, youtube).', 'sage'),
        ]
    );

    add_settings_field(
        'footer_quick_links',
        __('Quick links', 'sage'),
        __NAMESPACE__.'\\event_theme_render_textarea_field',
        'event-theme-global-settings',
        'event_theme_footer_section',
        [
            'option_name' => 'event_theme_global_settings',
            'field_key' => 'footer_quick_links',
            'rows' => 6,
            'placeholder' => "Home|/\nServices|#services",
            'description' => __('One per line: label|url', 'sage'),
        ]
    );

    add_settings_field(
        'footer_services_links',
        __('Services links', 'sage'),
        __NAMESPACE__.'\\event_theme_render_textarea_field',
        'event-theme-global-settings',
        'event_theme_footer_section',
        [
            'option_name' => 'event_theme_global_settings',
            'field_key' => 'footer_services_links',
            'rows' => 6,
            'placeholder' => "Event Production|#\nStage Design|#",
            'description' => __('One per line: label|url', 'sage'),
        ]
    );

    add_settings_field(
        'footer_bottom_links',
        __('Bottom links', 'sage'),
        __NAMESPACE__.'\\event_theme_render_textarea_field',
        'event-theme-global-settings',
        'event_theme_footer_section',
        [
            'option_name' => 'event_theme_global_settings',
            'field_key' => 'footer_bottom_links',
            'rows' => 4,
            'placeholder' => "Privacy Policy|#",
            'description' => __('One per line: label|url', 'sage'),
        ]
    );
});
