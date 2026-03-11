import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
  URLInputButton,
  useBlockProps,
} from '@wordpress/block-editor';
import {
  Button,
  PanelBody,
  TextControl,
  TextareaControl,
} from '@wordpress/components';
import metadata from './block.json';

const HeroContent = ({ attributes }) => {
  const backgroundStyle = attributes.backgroundImageUrl
    ? { backgroundImage: `url(${attributes.backgroundImageUrl})` }
    : undefined;

  return (
    <section className="event-hero" style={backgroundStyle}>
      <div className="event-hero-bg" aria-hidden="true" />
      <div className="event-hero-cursor-glow" aria-hidden="true" />

      <div className="mx-auto w-full max-w-[1440px]">
        <div className="event-hero-content">
          <h1 className="event-hero-title">
            <span className="event-hero-line event-hero-reveal" style={{ '--delay': '0ms' }}>{attributes.lineOne}</span>
            <span className="event-hero-line event-hero-line-gradient event-hero-reveal" style={{ '--delay': '120ms' }}>{attributes.lineTwo}</span>
            <span className="event-hero-line event-hero-reveal" style={{ '--delay': '240ms' }}>{attributes.lineThree}</span>
          </h1>

          <p className="event-hero-description event-hero-reveal" style={{ '--delay': '360ms' }}>
            {attributes.description}
          </p>

          <div className="event-hero-cta event-hero-reveal" style={{ '--delay': '480ms' }}>
            <a href={attributes.primaryUrl || '#'} className="event-hero-btn event-hero-btn-primary">
              <span>{attributes.primaryLabel}</span>
              <span aria-hidden="true">→</span>
            </a>

            <a href={attributes.secondaryUrl || '#'} className="event-hero-btn event-hero-btn-secondary">
              <span aria-hidden="true">▷</span>
              <span>{attributes.secondaryLabel}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="event-hero-scroll" aria-hidden="true">
        <span className="event-hero-scroll-dot" />
      </div>
    </section>
  );
};

registerBlockType(metadata.name, {
  ...metadata,
  edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'alignfull event-hero-editor-preview' });

    return (
      <div {...blockProps}>
        <InspectorControls>
          <PanelBody title={__('Hero lines', 'sage')} initialOpen>
            <div className="event-inspector-group">
              <TextControl
                label={__('Line 1', 'sage')}
                value={attributes.lineOne}
                onChange={(lineOne) => setAttributes({ lineOne })}
              />
              <TextControl
                label={__('Line 2 (gradient)', 'sage')}
                value={attributes.lineTwo}
                onChange={(lineTwo) => setAttributes({ lineTwo })}
              />
              <TextControl
                label={__('Line 3', 'sage')}
                value={attributes.lineThree}
                onChange={(lineThree) => setAttributes({ lineThree })}
              />
              <TextareaControl
                label={__('Description', 'sage')}
                value={attributes.description}
                onChange={(description) => setAttributes({ description })}
              />
            </div>
          </PanelBody>

          <PanelBody title={__('Buttons', 'sage')} initialOpen={false}>
            <div className="event-inspector-group">
              <TextControl
                label={__('Primary button label', 'sage')}
                value={attributes.primaryLabel}
                onChange={(primaryLabel) => setAttributes({ primaryLabel })}
              />
              <div className="event-url-control">
                <p className="components-base-control__label">{__('Primary button URL', 'sage')}</p>
                <URLInputButton
                  url={attributes.primaryUrl}
                  onChange={(primaryUrl) => setAttributes({ primaryUrl })}
                />
              </div>
              <TextControl
                label={__('Secondary button label', 'sage')}
                value={attributes.secondaryLabel}
                onChange={(secondaryLabel) => setAttributes({ secondaryLabel })}
              />
              <div className="event-url-control">
                <p className="components-base-control__label">{__('Secondary button URL', 'sage')}</p>
                <URLInputButton
                  url={attributes.secondaryUrl}
                  onChange={(secondaryUrl) => setAttributes({ secondaryUrl })}
                />
              </div>
            </div>
          </PanelBody>

          <PanelBody title={__('Background', 'sage')} initialOpen={false}>
            <div className="event-inspector-group">
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => setAttributes({
                    backgroundImageId: media?.id || 0,
                    backgroundImageUrl: media?.url || '',
                  })}
                  allowedTypes={['image']}
                  value={attributes.backgroundImageId || 0}
                  render={({ open }) => (
                    <Button variant="primary" onClick={open}>
                      {attributes.backgroundImageUrl
                        ? __('Replace background image', 'sage')
                        : __('Choose background image', 'sage')}
                    </Button>
                  )}
                />
              </MediaUploadCheck>

              {attributes.backgroundImageUrl ? (
                <>
                  <img
                    src={attributes.backgroundImageUrl}
                    alt=""
                    style={{
                      width: '100%',
                      borderRadius: '10px',
                      border: '1px solid #d4d4d8',
                    }}
                  />
                  <Button
                    variant="secondary"
                    isDestructive
                    onClick={() => setAttributes({ backgroundImageId: 0, backgroundImageUrl: '' })}
                  >
                    {__('Remove background image', 'sage')}
                  </Button>
                </>
              ) : null}
            </div>
          </PanelBody>
        </InspectorControls>

        <HeroContent attributes={attributes} />
      </div>
    );
  },
  save({ attributes }) {
    return <HeroContent attributes={attributes} />;
  },
});
