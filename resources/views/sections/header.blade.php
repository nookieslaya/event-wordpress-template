@php
    $globalSettings = function_exists('\App\event_theme_get_global_settings')
        ? \App\event_theme_get_global_settings()
        : [];

    $logoUrl = trim((string) ($globalSettings['logo_url'] ?? ''));
    $logoAlt = trim((string) ($globalSettings['logo_alt'] ?? '')) ?: $siteName;
    $logoText = trim((string) ($globalSettings['logo_text'] ?? '')) ?: $siteName;

    $logoParts = preg_split('/\s+/', $logoText, 2) ?: [$logoText];
    $logoPrimary = $logoParts[0] ?? $logoText;
    $logoSecondary = $logoParts[1] ?? '';

@endphp

<header class="event-header">
    <div class="mx-auto flex h-24 w-full max-w-[1440px] items-center gap-6 px-5 md:px-8">
        <a href="{{ home_url('/') }}" class="shrink-0 !no-underline" aria-label="{{ esc_attr($siteName) }}">
            @if ($logoUrl !== '')
                <img src="{{ esc_url($logoUrl) }}" alt="{{ esc_attr($logoAlt) }}" class="h-8 w-auto md:h-10" loading="eager"
                    decoding="async" />
            @else
                <span
                    class="event-logo text-[1.7rem] font-extrabold uppercase leading-none tracking-[-0.02em] md:text-[2.5rem]">
                    <span class="event-logo-gradient">{{ $logoPrimary }}</span>
                    @if ($logoSecondary !== '')
                        <span class="text-white"> {{ $logoSecondary }}</span>
                    @endif
                </span>
            @endif
        </a>

        <nav class="ml-auto hidden lg:block" aria-label="{{ __('Primary Navigation', 'sage') }}">
            {!! wp_nav_menu([
                'theme_location' => 'primary_navigation',
                'menu_class' => 'event-nav-desktop',
                'container' => false,
                'echo' => false,
                'fallback_cb' => 'wp_page_menu',
            ]) !!}
        </nav>

        <button type="button"
            class="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-white hover:bg-white/10 lg:hidden"
            aria-expanded="false" aria-controls="event-mobile-menu" aria-label="{{ __('Open menu', 'sage') }}"
            data-mobile-menu-open>
            <svg viewBox="0 0 24 24" aria-hidden="true" class="event-menu-icon">
                <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
        </button>
    </div>
</header>

<div id="event-mobile-menu" class="fixed inset-0 z-[80] hidden bg-black" data-mobile-menu-panel>
    <div class="flex h-24 items-center justify-between px-4 md:px-8">
        <a href="{{ home_url('/') }}" class="shrink-0 !no-underline" aria-label="{{ esc_attr($siteName) }}">
            @if ($logoUrl !== '')
                <img src="{{ esc_url($logoUrl) }}" alt="{{ esc_attr($logoAlt) }}" class="h-8 w-auto" loading="eager"
                    decoding="async" />
            @else
                <span class="event-logo text-[1.7rem] font-extrabold uppercase leading-none tracking-tight">
                    <span class="event-logo-gradient">{{ $logoPrimary }}</span>
                    @if ($logoSecondary !== '')
                        <span class="text-white"> {{ $logoSecondary }}</span>
                    @endif
                </span>
            @endif
        </a>

        <button type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-white hover:bg-white/10"
            aria-label="{{ __('Close menu', 'sage') }}" data-mobile-menu-close>
            <svg viewBox="0 0 24 24" aria-hidden="true" class="event-menu-icon">
                <path d="M6 6l12 12M18 6 6 18" />
            </svg>
        </button>
    </div>

    <nav class="px-6 pb-12 pt-8" aria-label="{{ __('Mobile navigation', 'sage') }}">
        {!! wp_nav_menu([
            'theme_location' => 'primary_navigation',
            'menu_class' => 'event-nav-mobile',
            'container' => false,
            'echo' => false,
            'fallback_cb' => 'wp_page_menu',
        ]) !!}
    </nav>
</div>
