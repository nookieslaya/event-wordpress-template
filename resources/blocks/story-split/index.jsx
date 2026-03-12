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

const StorySplitContent = ({ attributes }) => (
  <section className="event-story-split w-full py-16 md:py-20">
    <div className="event-section-container">
      <div className="event-story-shell grid gap-6 overflow-hidden lg:grid-cols-2 lg:gap-10">
        <div className="event-story-panel event-story-panel-left flex items-center bg-black py-10 lg:pr-4">
          <div className="max-w-3xl">
            <h2 className="event-story-title">
              <span>{attributes.lineOne}</span>
              <span className="event-story-title-gradient">{attributes.lineTwo}</span>
              <span>{attributes.lineThree}</span>
            </h2>

            <p className="event-story-description">
              {attributes.description}
            </p>

            <a href={attributes.linkUrl || '#'} className="event-story-link">
              <span>{attributes.linkLabel}</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="event-story-panel event-story-panel-right relative min-h-[260px] bg-zinc-900 md:min-h-[320px] lg:min-h-[420px]">
          {attributes.imageUrl ? (
            <img
              className="h-full w-full object-cover"
              src={attributes.imageUrl}
              alt=""
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold tracking-[0.2em] text-white/55">
              {__('ADD IMAGE', 'sage')}
            </div>
          )}
        </div>
      </div>
    </div>
  </section>
);

registerBlockType(metadata.name, {
  ...metadata,
  edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({ className: 'alignfull event-story-editor-preview' });

    return (
      <div {...blockProps}>
        <InspectorControls>
          <PanelBody title={__('Content', 'sage')} initialOpen>
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
              <TextControl
                label={__('Link label', 'sage')}
                value={attributes.linkLabel}
                onChange={(linkLabel) => setAttributes({ linkLabel })}
              />
              <div className="event-url-control">
                <p className="components-base-control__label">{__('Link URL', 'sage')}</p>
                <URLInputButton
                  url={attributes.linkUrl}
                  onChange={(linkUrl) => setAttributes({ linkUrl })}
                />
              </div>
            </div>
          </PanelBody>

          <PanelBody title={__('Image', 'sage')} initialOpen={false}>
            <div className="event-inspector-group">
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={(media) => setAttributes({
                    imageId: media?.id || 0,
                    imageUrl: media?.url || '',
                  })}
                  allowedTypes={['image']}
                  value={attributes.imageId || 0}
                  render={({ open }) => (
                    <Button variant="primary" onClick={open}>
                      {attributes.imageUrl
                        ? __('Replace image', 'sage')
                        : __('Choose image', 'sage')}
                    </Button>
                  )}
                />
              </MediaUploadCheck>

              {attributes.imageUrl ? (
                <>
                  <img
                    src={attributes.imageUrl}
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
                    onClick={() => setAttributes({ imageId: 0, imageUrl: '' })}
                  >
                    {__('Remove image', 'sage')}
                  </Button>
                </>
              ) : null}
            </div>
          </PanelBody>
        </InspectorControls>

        <StorySplitContent attributes={attributes} />
      </div>
    );
  },
  save({ attributes }) {
    return <StorySplitContent attributes={attributes} />;
  },
});
