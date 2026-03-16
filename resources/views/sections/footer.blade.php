@php
    $settings = function_exists('\App\event_theme_get_global_settings')
        ? \App\event_theme_get_global_settings()
        : [];

    $siteName = get_bloginfo('name');

    $brandName = trim((string) ($settings['footer_brand_name'] ?? '')) ?: $siteName;
    $brandDescription = trim((string) ($settings['footer_brand_description'] ?? ''));

    $parseLinkRows = static function ($raw): array {
        $rows = preg_split('/\r\n|\r|\n/', (string) $raw) ?: [];
        $items = [];

        foreach ($rows as $row) {
            $row = trim((string) $row);
            if ($row === '') {
                continue;
            }

            [$label, $url] = array_pad(array_map('trim', explode('|', $row, 2)), 2, '');
            if ($label === '') {
                continue;
            }

            $items[] = [
                'label' => $label,
                'url' => $url,
            ];
        }

        return $items;
    };

    $socialRows = $parseLinkRows($settings['footer_social_links'] ?? '');
    $quickLinks = $parseLinkRows($settings['footer_quick_links'] ?? '');
    $serviceLinks = $parseLinkRows($settings['footer_services_links'] ?? '');
    $bottomLinks = $parseLinkRows($settings['footer_bottom_links'] ?? '');

    $footerEmail = trim((string) ($settings['footer_contact_email'] ?? ''));
    $footerPhone = trim((string) ($settings['footer_contact_phone'] ?? ''));
    $footerAddressOne = trim((string) ($settings['footer_contact_address_line1'] ?? ''));
    $footerAddressTwo = trim((string) ($settings['footer_contact_address_line2'] ?? ''));
    $footerCopyright = trim((string) ($settings['footer_copyright'] ?? ''));

    $brandParts = preg_split('/\s+/', $brandName, 2) ?: [$brandName];
    $brandPrimary = $brandParts[0] ?? $brandName;
    $brandSecondary = $brandParts[1] ?? '';

    $socialIcons = [
        'facebook' => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3.1l.9-4H13V9c0-.6.4-1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'instagram' => '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3.7" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.8" r="0.8" fill="currentColor"/></svg>',
        'twitter' => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 5.8c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.8.5-1.6.8-2.5 1A3.8 3.8 0 0 0 12.6 8c0 .3 0 .6.1.9A10.8 10.8 0 0 1 4.8 5a3.8 3.8 0 0 0 1.2 5.1c-.6 0-1.2-.2-1.7-.5v.1c0 1.8 1.3 3.4 3.1 3.7-.3.1-.7.1-1 .1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.9A7.8 7.8 0 0 1 4 18.1 11 11 0 0 0 10 20c7.2 0 11.2-6 11.2-11.2v-.5c.8-.5 1.4-1.1 1.8-1.8Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'linkedin' => '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="9" width="4" height="11" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="6" cy="5.5" r="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 20V9h4v1.8c.7-1.2 1.8-2 3.4-2 2.6 0 3.6 1.7 3.6 4.3V20h-4v-5.8c0-1.1-.4-2-1.6-2s-2 .9-2 2V20h-4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'youtube' => '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m10 9 5 3-5 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ];
@endphp

<footer class="event-site-footer">
    <div class="event-site-footer__topline" aria-hidden="true"></div>

    <div class="event-section-container">
        <div class="event-site-footer__grid">
            <div>
                <h3 class="event-site-footer__brand">
                    <span class="event-site-footer__brand-gradient">{{ $brandPrimary }}</span>
                    @if ($brandSecondary !== '')
                        <span class="text-white"> {{ $brandSecondary }}</span>
                    @endif
                </h3>

                @if ($brandDescription !== '')
                    <p class="event-site-footer__description">{{ $brandDescription }}</p>
                @endif

                @if (!empty($socialRows))
                    <div class="event-site-footer__socials">
                        @foreach ($socialRows as $social)
                            @php
                                $platform = strtolower(trim((string) ($social['label'] ?? '')));
                                $url = trim((string) ($social['url'] ?? ''));
                            @endphp

                            @if ($url !== '')
                                <a href="{{ esc_url($url) }}" target="_blank" rel="noopener noreferrer"
                                    class="event-site-footer__social-link" aria-label="{{ esc_attr(ucfirst($platform)) }}">
                                    {!! $socialIcons[$platform] ?? $socialIcons['facebook'] !!}
                                </a>
                            @endif
                        @endforeach
                    </div>
                @endif
            </div>

            <div>
                <h4 class="event-site-footer__heading">{{ __('Quick Links', 'sage') }}</h4>
                @if (!empty($quickLinks))
                    <ul class="event-site-footer__list">
                        @foreach ($quickLinks as $link)
                            <li>
                                @if (($link['url'] ?? '') !== '')
                                    <a href="{{ esc_url($link['url']) }}">{{ $link['label'] }}</a>
                                @else
                                    <span>{{ $link['label'] }}</span>
                                @endif
                            </li>
                        @endforeach
                    </ul>
                @endif
            </div>

            <div>
                <h4 class="event-site-footer__heading">{{ __('Services', 'sage') }}</h4>
                @if (!empty($serviceLinks))
                    <ul class="event-site-footer__list">
                        @foreach ($serviceLinks as $link)
                            <li>
                                @if (($link['url'] ?? '') !== '')
                                    <a href="{{ esc_url($link['url']) }}">{{ $link['label'] }}</a>
                                @else
                                    <span>{{ $link['label'] }}</span>
                                @endif
                            </li>
                        @endforeach
                    </ul>
                @endif
            </div>

            <div>
                <h4 class="event-site-footer__heading">{{ __('Contact', 'sage') }}</h4>
                <ul class="event-site-footer__contact-list">
                    @if ($footerEmail !== '')
                        <li>
                            <span class="event-site-footer__contact-icon" aria-hidden="true">✉</span>
                            <a href="mailto:{!! antispambot($footerEmail) !!}">{!! antispambot($footerEmail) !!}</a>
                        </li>
                    @endif
                    @if ($footerPhone !== '')
                        <li>
                            <span class="event-site-footer__contact-icon" aria-hidden="true">☎</span>
                            <a href="tel:{{ preg_replace('/[^\d\+]/', '', $footerPhone) }}">{{ $footerPhone }}</a>
                        </li>
                    @endif
                    @if ($footerAddressOne !== '' || $footerAddressTwo !== '')
                        <li>
                            <span class="event-site-footer__contact-icon" aria-hidden="true">◎</span>
                            <span>
                                {{ $footerAddressOne }}
                                @if ($footerAddressTwo !== '')
                                    <br>{{ $footerAddressTwo }}
                                @endif
                            </span>
                        </li>
                    @endif
                </ul>
            </div>
        </div>

        <div class="event-site-footer__bottom">
            <p>{{ $footerCopyright !== '' ? $footerCopyright : '© '.date('Y').' '.$siteName }}</p>

            @if (!empty($bottomLinks))
                <ul>
                    @foreach ($bottomLinks as $link)
                        <li>
                            @if (($link['url'] ?? '') !== '')
                                <a href="{{ esc_url($link['url']) }}">{{ $link['label'] }}</a>
                            @else
                                <span>{{ $link['label'] }}</span>
                            @endif
                        </li>
                    @endforeach
                </ul>
            @endif
        </div>
    </div>
</footer>
