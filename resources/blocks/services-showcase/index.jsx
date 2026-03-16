import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
  useBlockProps,
} from '@wordpress/block-editor';
import {
  Button,
  PanelBody,
  SelectControl,
  TextControl,
  TextareaControl,
} from '@wordpress/components';
import metadata from './block.json';

const HEX_COLOR_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

const hexToRgb = (hex) => {
  if (!HEX_COLOR_RE.test(hex || '')) {
    return [168, 85, 247];
  }

  const normalized = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;

  return [
    parseInt(normalized.slice(1, 3), 16),
    parseInt(normalized.slice(3, 5), 16),
    parseInt(normalized.slice(5, 7), 16),
  ];
};

const DEFAULT_ICON_KEYS = [
  'sparkles',
  'stage',
  'lightbulb',
  'audio',
  'video',
  'festival',
  'briefcase',
  'settings',
];

const ICON_OPTIONS = [
  { label: 'Sparkles', value: 'sparkles' },
  { label: 'Stage', value: 'stage' },
  { label: 'Lightbulb', value: 'lightbulb' },
  { label: 'Audio', value: 'audio' },
  { label: 'Video', value: 'video' },
  { label: 'Festival', value: 'festival' },
  { label: 'Briefcase', value: 'briefcase' },
  { label: 'Settings', value: 'settings' },
];

const ServiceIcon = ({ iconKey }) => {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.9,
  };

  const wrap = (children) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="event-services-showcase__icon-svg">
      {children}
    </svg>
  );

  switch (iconKey) {
    case 'stage':
      return wrap(
        <>
          <rect {...common} x="3" y="9" width="18" height="10" rx="2" />
          <path {...common} d="M7 9V6m10 3V6M6 19v2m12-2v2" />
        </>,
      );
    case 'lightbulb':
      return wrap(
        <>
          <path {...common} d="M9 18h6m-5 3h4M12 3a6 6 0 0 0-3 11v2h6v-2a6 6 0 0 0-3-11Z" />
        </>,
      );
    case 'audio':
      return wrap(
        <>
          <path {...common} d="M4 13h3l4 4V7l-4 4H4z" />
          <path {...common} d="M16 9a4 4 0 0 1 0 6m2-8a7 7 0 0 1 0 10" />
        </>,
      );
    case 'video':
      return wrap(
        <>
          <rect {...common} x="3" y="7" width="13" height="10" rx="2" />
          <path {...common} d="M16 10l5-3v10l-5-3z" />
        </>,
      );
    case 'festival':
      return wrap(
        <>
          <path {...common} d="M12 3v18M3 9h18M5 5l14 14M19 5 5 19" />
        </>,
      );
    case 'briefcase':
      return wrap(
        <>
          <rect {...common} x="3" y="7" width="18" height="12" rx="2" />
          <path {...common} d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-5 6h4" />
        </>,
      );
    case 'settings':
      return wrap(
        <>
          <circle {...common} cx="12" cy="12" r="3.2" />
          <path {...common} d="M12 2v3m0 14v3M2 12h3m14 0h3M4.8 4.8l2.1 2.1m10.2 10.2 2.1 2.1m0-14.4-2.1 2.1M6.9 17.1l-2.1 2.1" />
        </>,
      );
    case 'sparkles':
    default:
      return wrap(
        <>
          <path {...common} d="M12 4l1.8 4.2L18 10l-4.2 1.8L12 16l-1.8-4.2L6 10l4.2-1.8zM18.5 4v2m-1-1h2" />
        </>,
      );
  }
};

const normalizeCards = (cards = []) => {
  const base = cards.length ? cards : metadata.attributes.cards.default;
  return base.map((item, index) => {
    const [r, g, b] = hexToRgb(item?.color);
    return {
      iconKey: item?.iconKey || DEFAULT_ICON_KEYS[index % DEFAULT_ICON_KEYS.length],
      icon: (item?.icon || '✦').slice(0, 2),
      iconId: Number(item?.iconId || 0),
      iconUrl: item?.iconUrl || '',
      title: item?.title || '',
      desc: item?.desc || '',
      color: HEX_COLOR_RE.test(item?.color || '') ? item.color : '#a855f7',
      rgb: `${r} ${g} ${b}`,
    };
  });
};

const ServicesShowcaseContent = ({ attributes }) => {
  const cards = normalizeCards(attributes.cards);

  return (
    <section className="event-services-showcase event-section-container py-14 md:py-24" id="our-services">
      <header className="mx-auto max-w-5xl text-center">
        <span className="event-services-showcase__badge event-services-showcase__reveal" style={{ '--delay': '0ms' }}>{attributes.badge}</span>
        <h2 className="event-services-showcase__title event-services-showcase__reveal" style={{ '--delay': '100ms' }}>
          <span>{attributes.titleLineOne}</span>
          <span className="event-services-showcase__title-gradient">{attributes.titleLineTwo}</span>
        </h2>
        <p className="event-services-showcase__subtitle event-services-showcase__reveal" style={{ '--delay': '200ms' }}>{attributes.subtitle}</p>
      </header>

      <div className="event-services-showcase__grid">
        {cards.map((card, index) => (
          <article
            key={`service-show-${index}`}
            className="event-services-showcase__card event-services-showcase__reveal"
            style={{ '--service-rgb': card.rgb, '--delay': `${280 + (index * 70)}ms` }}
          >
            <span className="event-services-showcase__icon" aria-hidden="true">
              {card.iconUrl ? (
                <img src={card.iconUrl} alt="" className="event-services-showcase__icon-image" />
              ) : (
                <ServiceIcon iconKey={card.iconKey} />
              )}
            </span>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

registerBlockType(metadata.name, {
  ...metadata,
  edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'alignfull' });
    const cards = normalizeCards(attributes.cards);
    const rawCards = attributes.cards?.length ? attributes.cards : metadata.attributes.cards.default;

    const setCards = (next) => setAttributes({ cards: next });

    const updateCard = (index, key, value) => {
      const next = rawCards.map((card, i) => (i === index ? { ...card, [key]: value } : card));
      setCards(next);
    };

    return (
      <section {...blockProps}>
        <InspectorControls>
          <PanelBody title={__('Section', 'sage')} initialOpen>
            <div className="event-inspector-group">
              <TextControl label={__('Badge', 'sage')} value={attributes.badge} onChange={(badge) => setAttributes({ badge })} />
              <TextControl label={__('Title line 1', 'sage')} value={attributes.titleLineOne} onChange={(titleLineOne) => setAttributes({ titleLineOne })} />
              <TextControl label={__('Title line 2', 'sage')} value={attributes.titleLineTwo} onChange={(titleLineTwo) => setAttributes({ titleLineTwo })} />
              <TextareaControl label={__('Subtitle', 'sage')} value={attributes.subtitle} onChange={(subtitle) => setAttributes({ subtitle })} />
            </div>
          </PanelBody>

          <PanelBody title={__('Cards', 'sage')} initialOpen={false}>
            {cards.map((card, index) => (
              <div key={`show-card-${index}`} className="event-inspector-group">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {`${__('Card', 'sage')} ${index + 1}`}
                </p>
                <SelectControl
                  label={__('Vector icon', 'sage')}
                  value={card.iconKey}
                  options={ICON_OPTIONS}
                  onChange={(value) => updateCard(index, 'iconKey', value)}
                />
                <TextControl label={__('Icon', 'sage')} value={card.icon} onChange={(value) => updateCard(index, 'icon', value)} />
                <MediaUploadCheck>
                  <MediaUpload
                    onSelect={(media) => {
                      const next = rawCards.map((rawCard, i) => (
                        i === index
                          ? { ...rawCard, iconId: media?.id || 0, iconUrl: media?.url || '' }
                          : rawCard
                      ));
                      setCards(next);
                    }}
                    allowedTypes={['image']}
                    value={card.iconId || 0}
                    render={({ open }) => (
                      <Button variant="secondary" onClick={open}>
                        {card.iconUrl ? __('Replace custom icon', 'sage') : __('Choose custom icon', 'sage')}
                      </Button>
                    )}
                  />
                </MediaUploadCheck>
                {card.iconUrl ? (
                  <>
                    <img
                      src={card.iconUrl}
                      alt=""
                      style={{
                        width: '64px',
                        height: '64px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        border: '1px solid #d4d4d8',
                      }}
                    />
                    <Button
                      variant="secondary"
                      isDestructive
                      onClick={() => {
                        const next = rawCards.map((rawCard, i) => (
                          i === index
                            ? { ...rawCard, iconId: 0, iconUrl: '' }
                            : rawCard
                        ));
                        setCards(next);
                      }}
                    >
                      {__('Remove custom icon', 'sage')}
                    </Button>
                  </>
                ) : null}
                <TextControl label={__('Title', 'sage')} value={card.title} onChange={(value) => updateCard(index, 'title', value)} />
                <TextareaControl label={__('Description', 'sage')} value={card.desc} onChange={(value) => updateCard(index, 'desc', value)} />
                <TextControl label={__('Accent color (hex)', 'sage')} value={card.color} onChange={(value) => updateCard(index, 'color', value)} />
              </div>
            ))}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() => setCards([...cards, { iconKey: 'sparkles', icon: '✦', iconId: 0, iconUrl: '', title: 'New Service', desc: 'Describe service.', color: '#a855f7' }])}
              >
                {__('Add card', 'sage')}
              </Button>
              <Button
                variant="secondary"
                isDestructive
                onClick={() => cards.length > 1 && setCards(cards.slice(0, -1))}
                disabled={cards.length <= 1}
              >
                {__('Remove last', 'sage')}
              </Button>
            </div>
          </PanelBody>
        </InspectorControls>

        <ServicesShowcaseContent attributes={attributes} />
      </section>
    );
  },
  save({ attributes }) {
    const blockProps = useBlockProps.save({ className: 'alignfull' });
    return (
      <section {...blockProps}>
        <ServicesShowcaseContent attributes={attributes} />
      </section>
    );
  },
});
