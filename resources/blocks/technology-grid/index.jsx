import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, TextareaControl } from '@wordpress/components';
import metadata from './block.json';

const HEX_COLOR_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const ICON_OPTIONS = [
  { label: 'Lighting', value: 'lighting' },
  { label: 'LED', value: 'led' },
  { label: 'Laser', value: 'laser' },
  { label: 'Audio', value: 'audio' },
  { label: 'Stage', value: 'stage' },
  { label: 'Control', value: 'control' },
];

const TechnologyIcon = ({ iconKey }) => {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.9,
  };
  const wrap = (children) => <svg viewBox="0 0 24 24" className="event-technology-grid__icon-svg" aria-hidden="true">{children}</svg>;

  switch (iconKey) {
    case 'led':
      return wrap(<><rect {...common} x="3" y="6" width="18" height="12" rx="2" /><path {...common} d="M8 19h8" /></>);
    case 'laser':
      return wrap(<><path {...common} d="m13 3-8 10h6l-1 8 9-12h-6z" /></>);
    case 'audio':
      return wrap(<><rect {...common} x="6" y="3" width="12" height="18" rx="2" /><circle {...common} cx="12" cy="14" r="3.2" /></>);
    case 'stage':
      return wrap(<><path {...common} d="M3 14h18M5 14v6m14-6v6M7 10l5-4 5 4" /></>);
    case 'control':
      return wrap(<><rect {...common} x="6" y="6" width="12" height="12" rx="2" /><path {...common} d="M12 3v3m0 12v3M3 12h3m12 0h3" /></>);
    case 'lighting':
    default:
      return wrap(<><path {...common} d="M12 3a6 6 0 0 0-3 11v2h6v-2a6 6 0 0 0-3-11Z" /><path {...common} d="M10 21h4" /></>);
  }
};

const hexToRgb = (hex) => {
  if (!HEX_COLOR_RE.test(hex || '')) {
    return [59, 130, 246];
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

const normalizeCards = (cards = []) => {
  const base = cards.length ? cards : metadata.attributes.cards.default;
  return base.map((card) => {
    const [r, g, b] = hexToRgb(card?.color);
    return {
      iconKey: card?.iconKey || 'lighting',
      icon: (card?.icon || '◌').slice(0, 2),
      title: card?.title || '',
      desc: card?.desc || '',
      tag: card?.tag || '',
      color: HEX_COLOR_RE.test(card?.color || '') ? card.color : '#3b82f6',
      rgb: `${r} ${g} ${b}`,
    };
  });
};

const TechnologyGridContent = ({ attributes }) => {
  const cards = normalizeCards(attributes.cards);

  return (
    <section className="event-technology-grid event-section-container py-14 md:py-24" id="technology" data-technology-grid>
      <header className="mx-auto max-w-5xl text-center">
        <span className="event-technology-grid__badge event-technology-grid__reveal" style={{ '--delay': '0ms' }}>{attributes.badge}</span>
        <h2 className="event-technology-grid__title event-technology-grid__reveal" style={{ '--delay': '100ms' }}>
          <span>{attributes.titleLineOne}</span>
          <span className="event-technology-grid__title-gradient">{attributes.titleLineTwo}</span>
        </h2>
        <p className="event-technology-grid__subtitle event-technology-grid__reveal" style={{ '--delay': '200ms' }}>{attributes.subtitle}</p>
      </header>

      <div className="event-technology-grid__cards">
        {cards.map((card, index) => (
          <article
            key={`tech-card-${index}`}
            className="event-technology-grid__card event-technology-grid__reveal"
            style={{ '--card-rgb': card.rgb, '--delay': `${280 + (index * 70)}ms` }}
            data-card-accent={card.rgb}
          >
            <span className="event-technology-grid__icon" aria-hidden="true">
              <TechnologyIcon iconKey={card.iconKey} />
            </span>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <small>{card.tag}</small>
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

    const setCards = (next) => setAttributes({ cards: next });
    const updateCard = (index, key, value) => {
      const next = cards.map((card, i) => (i === index ? { ...card, [key]: value } : card));
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
              <div key={`tech-card-control-${index}`} className="event-inspector-group">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {`${__('Card', 'sage')} ${index + 1}`}
                </p>
                <SelectControl
                  label={__('Icon type', 'sage')}
                  value={card.iconKey}
                  options={ICON_OPTIONS}
                  onChange={(value) => updateCard(index, 'iconKey', value)}
                />
                <TextControl label={__('Icon', 'sage')} value={card.icon} onChange={(value) => updateCard(index, 'icon', value)} />
                <TextControl label={__('Title', 'sage')} value={card.title} onChange={(value) => updateCard(index, 'title', value)} />
                <TextareaControl label={__('Description', 'sage')} value={card.desc} onChange={(value) => updateCard(index, 'desc', value)} />
                <TextControl label={__('Tag', 'sage')} value={card.tag} onChange={(value) => updateCard(index, 'tag', value)} />
                <TextControl label={__('Accent color (hex)', 'sage')} value={card.color} onChange={(value) => updateCard(index, 'color', value)} />
              </div>
            ))}
          </PanelBody>
        </InspectorControls>

        <TechnologyGridContent attributes={attributes} />
      </section>
    );
  },
  save({ attributes }) {
    const blockProps = useBlockProps.save({ className: 'alignfull' });
    return (
      <section {...blockProps}>
        <TechnologyGridContent attributes={attributes} />
      </section>
    );
  },
});
