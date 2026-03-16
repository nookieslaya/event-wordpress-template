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
} from '@wordpress/components';
import metadata from './block.json';

const SIZE_OPTIONS = [
  { label: 'Tall', value: 'tall' },
  { label: 'Medium', value: 'medium' },
  { label: 'Small', value: 'small' },
  { label: 'Wide', value: 'wide' },
];

const normalizeItems = (items = []) => {
  const base = items.length ? items : metadata.attributes.items.default;

  return base.map((item) => ({
    category: item?.category || '',
    title: item?.title || '',
    imageId: Number(item?.imageId || 0),
    imageUrl: item?.imageUrl || '',
    imageAlt: item?.imageAlt || '',
    size: item?.size || 'medium',
  }));
};

const VisualHighlightsContent = ({ attributes }) => {
  const items = normalizeItems(attributes.items);

  return (
    <section className="event-visual-highlights event-section-container py-14 md:py-24" id="gallery">
      <header className="text-center">
        <h2 className="event-visual-highlights__title">
          <span>{attributes.titleLineOne}</span>
          <span className="event-visual-highlights__title-gradient">{attributes.titleLineTwo}</span>
        </h2>
      </header>

      <div className="event-visual-highlights__grid">
        {items.map((item, index) => (
          <article
            key={`vh-item-${index}`}
            className={`event-vh-card event-vh-card--${item.size}`}
            data-vh-item
            data-vh-image={item.imageUrl || ''}
            data-vh-alt={item.imageAlt || item.title || ''}
          >
            <div className="event-vh-card__media" aria-hidden="true">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.imageAlt || ''} className="event-vh-card__image" />
              ) : (
                <div className="event-vh-card__image event-vh-card__image--fallback" />
              )}
            </div>
            {item.imageUrl ? (
              <button type="button" className="event-vh-card__open" aria-label={__('Open image in lightbox', 'sage')} />
            ) : null}
            <div className="event-vh-card__overlay" aria-hidden="true" />
            <div className="event-vh-card__content">
              <span>{item.category}</span>
              <h3>{item.title}</h3>
            </div>
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
    const rawItems = attributes.items?.length ? attributes.items : metadata.attributes.items.default;

    const setItems = (next) => setAttributes({ items: next });

    const updateItem = (index, key, value) => {
      const next = rawItems.map((item, i) => (i === index ? { ...item, [key]: value } : item));
      setItems(next);
    };

    return (
      <section {...blockProps}>
        <InspectorControls>
          <PanelBody title={__('Section', 'sage')} initialOpen>
            <div className="event-inspector-group">
              <TextControl label={__('Title line 1', 'sage')} value={attributes.titleLineOne} onChange={(titleLineOne) => setAttributes({ titleLineOne })} />
              <TextControl label={__('Title line 2', 'sage')} value={attributes.titleLineTwo} onChange={(titleLineTwo) => setAttributes({ titleLineTwo })} />
            </div>
          </PanelBody>

          <PanelBody title={__('Gallery items', 'sage')} initialOpen={false}>
            {items.map((item, index) => (
              <div key={`vh-item-control-${index}`} className="event-inspector-group">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{`${__('Item', 'sage')} ${index + 1}`}</p>
                <TextControl label={__('Category', 'sage')} value={item.category} onChange={(value) => updateItem(index, 'category', value)} />
                <TextControl label={__('Title', 'sage')} value={item.title} onChange={(value) => updateItem(index, 'title', value)} />
                <SelectControl label={__('Tile size', 'sage')} value={item.size} options={SIZE_OPTIONS} onChange={(value) => updateItem(index, 'size', value)} />

                <MediaUploadCheck>
                  <MediaUpload
                    onSelect={(media) => {
                      const next = rawItems.map((rawItem, i) => (
                        i === index
                          ? {
                            ...rawItem,
                            imageId: media?.id || 0,
                            imageUrl: media?.url || '',
                            imageAlt: media?.alt || '',
                          }
                          : rawItem
                      ));
                      setItems(next);
                    }}
                    allowedTypes={['image']}
                    value={item.imageId || 0}
                    render={({ open }) => (
                      <Button variant="secondary" onClick={open}>
                        {item.imageUrl ? __('Replace image', 'sage') : __('Choose image', 'sage')}
                      </Button>
                    )}
                  />
                </MediaUploadCheck>

                {item.imageUrl ? (
                  <>
                    <img
                      src={item.imageUrl}
                      alt=""
                      style={{
                        width: '100%',
                        maxWidth: '320px',
                        borderRadius: '12px',
                        border: '1px solid #27272a',
                      }}
                    />
                    <TextControl label={__('Image alt text', 'sage')} value={item.imageAlt} onChange={(value) => updateItem(index, 'imageAlt', value)} />
                    <Button
                      variant="secondary"
                      isDestructive
                      onClick={() => {
                        const next = rawItems.map((rawItem, i) => (
                          i === index
                            ? { ...rawItem, imageId: 0, imageUrl: '', imageAlt: '' }
                            : rawItem
                        ));
                        setItems(next);
                      }}
                    >
                      {__('Remove image', 'sage')}
                    </Button>
                  </>
                ) : null}
              </div>
            ))}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() => setItems([...items, { category: 'Category', title: 'New Item', imageId: 0, imageUrl: '', imageAlt: '', size: 'medium' }])}
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

        <VisualHighlightsContent attributes={attributes} />
      </section>
    );
  },
  save({ attributes }) {
    const blockProps = useBlockProps.save({ className: 'alignfull' });
    return (
      <section {...blockProps}>
        <VisualHighlightsContent attributes={attributes} />
      </section>
    );
  },
});
