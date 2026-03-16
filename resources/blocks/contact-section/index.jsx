import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
  Button,
  PanelBody,
  SelectControl,
  TextControl,
  TextareaControl,
} from '@wordpress/components';
import { RawHTML } from '@wordpress/element';
import metadata from './block.json';

const ICON_OPTIONS = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Location', value: 'location' },
];

const ContactIcon = ({ iconKey }) => {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const wrap = (children) => (
    <svg viewBox="0 0 24 24" className="event-contact__icon-svg" aria-hidden="true">
      {children}
    </svg>
  );

  if (iconKey === 'phone') {
    return wrap(<path {...common} d="M6.5 4.5h3l1.5 4-2 1.6a14.5 14.5 0 0 0 4.9 4.9l1.6-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.7a2 2 0 0 1 2-2.2Z" />);
  }

  if (iconKey === 'location') {
    return wrap(
      <>
        <path {...common} d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
        <circle {...common} cx="12" cy="10" r="2.5" />
      </>,
    );
  }

  return wrap(
    <>
      <rect {...common} x="3" y="5" width="18" height="14" rx="2" />
      <path {...common} d="m3 7 9 7 9-7" />
    </>,
  );
};

const normalizeItems = (items = []) => {
  const base = items.length ? items : metadata.attributes.contactItems.default;
  return base.map((item) => ({
    iconKey: item?.iconKey || 'email',
    label: item?.label || '',
    value: item?.value || '',
  }));
};

const ContactSectionContent = ({ attributes, isEditor = false }) => {
  const items = normalizeItems(attributes.contactItems);

  return (
    <section className="event-contact py-14 md:py-24" id="contact">
      <div className="event-section-container">
        <div className="event-contact__layout">
          <div className="event-contact__left">
            <span className="event-contact__badge">{attributes.badge}</span>
            <h2 className="event-contact__title">
              <span>{attributes.titleLineOne}</span>
              <span className="event-contact__title-gradient">{attributes.titleLineTwo}</span>
            </h2>
            <p className="event-contact__description">{attributes.description}</p>

            <div className="event-contact__items">
              {items.map((item, index) => (
                <article key={`contact-item-${index}`} className="event-contact__item">
                  <span className="event-contact__icon" aria-hidden="true">
                    <ContactIcon iconKey={item.iconKey} />
                  </span>
                  <div>
                    <span className="event-contact__item-label">{item.label}</span>
                    <p className="event-contact__item-value">{item.value}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="event-contact__right">
            <div className="event-contact__form-card">
              {attributes.formShortcode ? (
                isEditor
                  ? <pre className="event-contact__shortcode-preview">{attributes.formShortcode}</pre>
                  : <RawHTML>{attributes.formShortcode}</RawHTML>
              ) : (
                <div className="event-contact__shortcode-empty">{__('Add Fluent Form shortcode in block settings.', 'sage')}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

registerBlockType(metadata.name, {
  ...metadata,
  edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'alignfull' });
    const items = normalizeItems(attributes.contactItems);
    const rawItems = attributes.contactItems?.length ? attributes.contactItems : metadata.attributes.contactItems.default;

    const setItems = (next) => setAttributes({ contactItems: next });

    const updateItem = (index, key, value) => {
      const next = rawItems.map((item, i) => (i === index ? { ...item, [key]: value } : item));
      setItems(next);
    };

    return (
      <section {...blockProps}>
        <InspectorControls>
          <PanelBody title={__('Section', 'sage')} initialOpen>
            <div className="event-inspector-group">
              <TextControl label={__('Badge', 'sage')} value={attributes.badge} onChange={(badge) => setAttributes({ badge })} />
              <TextControl label={__('Title line 1', 'sage')} value={attributes.titleLineOne} onChange={(titleLineOne) => setAttributes({ titleLineOne })} />
              <TextControl label={__('Title line 2', 'sage')} value={attributes.titleLineTwo} onChange={(titleLineTwo) => setAttributes({ titleLineTwo })} />
              <TextareaControl label={__('Description', 'sage')} value={attributes.description} onChange={(description) => setAttributes({ description })} />
              <TextareaControl label={__('Form shortcode', 'sage')} value={attributes.formShortcode} onChange={(formShortcode) => setAttributes({ formShortcode })} help={__('Example: [fluentform id="1"]', 'sage')} />
            </div>
          </PanelBody>

          <PanelBody title={__('Contact items', 'sage')} initialOpen={false}>
            {items.map((item, index) => (
              <div key={`contact-item-control-${index}`} className="event-inspector-group">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{`${__('Item', 'sage')} ${index + 1}`}</p>
                <SelectControl
                  label={__('Icon', 'sage')}
                  value={item.iconKey}
                  options={ICON_OPTIONS}
                  onChange={(iconKey) => updateItem(index, 'iconKey', iconKey)}
                />
                <TextControl label={__('Label', 'sage')} value={item.label} onChange={(label) => updateItem(index, 'label', label)} />
                <TextControl label={__('Value', 'sage')} value={item.value} onChange={(value) => updateItem(index, 'value', value)} />
              </div>
            ))}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() => setItems([...items, { iconKey: 'email', label: 'Label', value: 'Value' }])}
              >
                {__('Add item', 'sage')}
              </Button>
              <Button
                variant="secondary"
                isDestructive
                onClick={() => items.length > 1 && setItems(items.slice(0, -1))}
                disabled={items.length <= 1}
              >
                {__('Remove last', 'sage')}
              </Button>
            </div>
          </PanelBody>
        </InspectorControls>

        <ContactSectionContent attributes={attributes} isEditor />
      </section>
    );
  },
  save({ attributes }) {
    const blockProps = useBlockProps.save({ className: 'alignfull' });
    return (
      <section {...blockProps}>
        <ContactSectionContent attributes={attributes} />
      </section>
    );
  },
});
