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
  TextControl,
  TextareaControl,
} from '@wordpress/components';
import metadata from './block.json';
import {
  getLegacyLocalized,
  getItemLegacyLocalized,
} from '../shared';

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

const normalizeItems = (items = []) => items.map((item, index) => {
  const [r, g, b] = hexToRgb(item?.color);

  return {
    title: getItemLegacyLocalized(item, 'title'),
    desc: getItemLegacyLocalized(item, 'desc'),
    icon: (item?.icon || ['✦', '▣', '◉', '◌', '◎', '↗'][index] || '✦').slice(0, 2),
    iconId: Number(item?.iconId || 0),
    iconUrl: item?.iconUrl || '',
    color: HEX_COLOR_RE.test(item?.color || '') ? item.color : '#a855f7',
    rgb: `${r} ${g} ${b}`,
  };
});

const ServicesContent = ({ attributes }) => {
  const titlePrefix = attributes.titlePrefix || 'OUR';
  const titleHighlight = attributes.titleHighlight || 'EXPERTISE';
  const subtitle = attributes.subtitle
    || getLegacyLocalized(attributes, 'headline', 'From concept to execution, we deliver comprehensive event production solutions');
  const linkLabel = attributes.linkLabel || 'Learn More';
  const items = normalizeItems(attributes.items);

  return (
    <section className="event-section-container event-expertise-section scroll-mt-32 py-14 md:py-24" id="services">
      <header className="mx-auto max-w-5xl text-center">
        <h2 className="event-expertise-title event-expertise-reveal" style={{ '--delay': '0ms' }}>
          <span>{titlePrefix}</span>{' '}
          <span className="event-expertise-title-gradient">{titleHighlight}</span>
        </h2>
        <p className="event-expertise-subtitle event-expertise-reveal" style={{ '--delay': '100ms' }}>{subtitle}</p>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {items.map((item, index) => (
          <article
            key={`service-${index}`}
            className="event-expertise-card event-expertise-reveal"
            style={{
              '--accent-rgb': item.rgb,
              '--delay': `${180 + (index * 85)}ms`,
            }}
          >
            <div className="event-expertise-icon" aria-hidden="true">
              {item.iconUrl ? (
                <img src={item.iconUrl} alt="" className="event-expertise-icon-image" />
              ) : (
                <span>{item.icon}</span>
              )}
            </div>
            <h3 className="event-expertise-card-title">{item.title}</h3>
            <p className="event-expertise-card-desc">{item.desc}</p>
            <a href="#contact" className="event-expertise-link">
              <span>{linkLabel}</span>
              <span className="event-expertise-link-arrow" aria-hidden="true">→</span>
            </a>
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
    const items = normalizeItems(attributes.items);
    const rawItems = attributes.items || [];

    const setItems = (nextItems) => {
      setAttributes({ items: nextItems });
    };

    const updateItem = (index, key, value) => {
      const nextItems = rawItems.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [key]: value } : item
      ));
      setItems(nextItems);
    };

    const addItem = () => {
      setItems([
        ...items,
        {
          title: '',
          desc: '',
          icon: '✦',
          iconId: 0,
          iconUrl: '',
          color: '#a855f7',
        },
      ]);
    };

    const removeItem = (index) => {
      if (items.length <= 1) {
        return;
      }

      setItems(items.filter((_, itemIndex) => itemIndex !== index));
    };

    const moveItem = (index, direction) => {
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= items.length) {
        return;
      }

      const nextItems = [...items];
      const currentItem = nextItems[index];
      nextItems[index] = nextItems[targetIndex];
      nextItems[targetIndex] = currentItem;
      setItems(nextItems);
    };

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Section', 'sage')} initialOpen>
            <div className="event-inspector-group">
              <TextControl
                label={__('Title prefix', 'sage')}
                value={attributes.titlePrefix || ''}
                onChange={(titlePrefix) => setAttributes({ titlePrefix })}
              />
              <TextControl
                label={__('Title highlight', 'sage')}
                value={attributes.titleHighlight || ''}
                onChange={(titleHighlight) => setAttributes({ titleHighlight })}
              />
              <TextareaControl
                label={__('Subtitle', 'sage')}
                value={attributes.subtitle || ''}
                onChange={(subtitle) => setAttributes({ subtitle })}
              />
              <TextControl
                label={__('Link label', 'sage')}
                value={attributes.linkLabel || ''}
                onChange={(linkLabel) => setAttributes({ linkLabel })}
              />
            </div>
          </PanelBody>

          <PanelBody title={__('Cards', 'sage')} initialOpen={false}>
            {items.map((item, index) => (
              <div key={`service-control-${index}`} className="event-inspector-group">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {`${__('Card', 'sage')} ${index + 1}`}
                </p>

                <TextControl
                  label={__('Title', 'sage')}
                  value={item.title}
                  onChange={(value) => updateItem(index, 'title', value)}
                />

                <TextareaControl
                  label={__('Description', 'sage')}
                  value={item.desc}
                  onChange={(value) => updateItem(index, 'desc', value)}
                />

                <TextControl
                  label={__('Icon (1-2 chars)', 'sage')}
                  value={item.icon}
                  onChange={(value) => updateItem(index, 'icon', value)}
                />

                <MediaUploadCheck>
                  <MediaUpload
                    onSelect={(media) => {
                      const nextItems = rawItems.map((rawItem, itemIndex) => (
                        itemIndex === index
                          ? {
                            ...rawItem,
                            iconId: media?.id || 0,
                            iconUrl: media?.url || '',
                          }
                          : rawItem
                      ));
                      setItems(nextItems);
                    }}
                    allowedTypes={['image']}
                    value={item.iconId || 0}
                    render={({ open }) => (
                      <Button variant="secondary" onClick={open}>
                        {item.iconUrl ? __('Replace custom icon', 'sage') : __('Choose custom icon', 'sage')}
                      </Button>
                    )}
                  />
                </MediaUploadCheck>

                {item.iconUrl ? (
                  <>
                    <img
                      src={item.iconUrl}
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
                        const nextItems = rawItems.map((rawItem, itemIndex) => (
                          itemIndex === index
                            ? { ...rawItem, iconId: 0, iconUrl: '' }
                            : rawItem
                        ));
                        setItems(nextItems);
                      }}
                    >
                      {__('Remove custom icon', 'sage')}
                    </Button>
                  </>
                ) : null}

                <TextControl
                  label={__('Accent color (hex)', 'sage')}
                  value={item.color}
                  onChange={(value) => updateItem(index, 'color', value)}
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                  >
                    {__('Move up', 'sage')}
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === items.length - 1}
                  >
                    {__('Move down', 'sage')}
                  </Button>

                  <Button
                    variant="secondary"
                    isDestructive
                    onClick={() => removeItem(index)}
                    disabled={items.length <= 1}
                  >
                    {__('Remove', 'sage')}
                  </Button>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <Button variant="primary" onClick={addItem}>
                {__('Add card', 'sage')}
              </Button>
            </div>
          </PanelBody>
        </InspectorControls>

        <section {...blockProps}>
          <ServicesContent attributes={attributes} />
        </section>
      </>
    );
  },
  save({ attributes }) {
    const blockProps = useBlockProps.save({ className: 'alignfull' });

    return (
      <section {...blockProps}>
        <ServicesContent attributes={attributes} />
      </section>
    );
  },
});
