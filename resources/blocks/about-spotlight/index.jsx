import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import metadata from './block.json';

const normalizeStats = (stats = []) => {
  const base = stats.length ? stats : metadata.attributes.stats.default;

  return base.map((item) => ({
    value: item?.value || '',
    label: item?.label || '',
  }));
};

const AboutSpotlightContent = ({ attributes }) => {
  const stats = normalizeStats(attributes.stats);

  return (
    <section className="event-about-spotlight py-14 md:py-24" data-about-spotlight>
      <div className="event-about-spotlight__light" aria-hidden="true" />
      <div className="event-about-spotlight__cursor" aria-hidden="true" />

      <div className="event-section-container">
        <div className="event-about-spotlight__content">
          <div className="event-about-spotlight__left">
            <span className="event-about-spotlight__badge">{attributes.badge}</span>
            <h2 className="event-about-spotlight__title">
              <span>{attributes.lineOne}</span>
              <span className="event-about-spotlight__title-gradient">{attributes.lineTwo}</span>
            </h2>
            <p>{attributes.paragraphOne}</p>
            <p>{attributes.paragraphTwo}</p>
          </div>

          <div className="event-about-spotlight__right">
            {stats.map((item, index) => (
              <article key={`about-stat-${index}`} className="event-about-spotlight__card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
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
    const stats = normalizeStats(attributes.stats);

    const updateStat = (index, key, value) => {
      const next = stats.map((item, i) => (i === index ? { ...item, [key]: value } : item));
      setAttributes({ stats: next });
    };

    const addStat = () => {
      setAttributes({ stats: [...stats, { value: '0+', label: 'New Stat' }] });
    };

    const removeStat = (index) => {
      if (stats.length <= 1) {
        return;
      }

      setAttributes({ stats: stats.filter((_, i) => i !== index) });
    };

    return (
      <section {...blockProps}>
        <InspectorControls>
          <PanelBody title={__('Content', 'sage')} initialOpen>
            <div className="event-inspector-group">
              <TextControl
                label={__('Badge', 'sage')}
                value={attributes.badge}
                onChange={(badge) => setAttributes({ badge })}
              />
              <TextControl
                label={__('Title line 1', 'sage')}
                value={attributes.lineOne}
                onChange={(lineOne) => setAttributes({ lineOne })}
              />
              <TextControl
                label={__('Title line 2 (gradient)', 'sage')}
                value={attributes.lineTwo}
                onChange={(lineTwo) => setAttributes({ lineTwo })}
              />
              <TextareaControl
                label={__('Paragraph 1', 'sage')}
                value={attributes.paragraphOne}
                onChange={(paragraphOne) => setAttributes({ paragraphOne })}
              />
              <TextareaControl
                label={__('Paragraph 2', 'sage')}
                value={attributes.paragraphTwo}
                onChange={(paragraphTwo) => setAttributes({ paragraphTwo })}
              />
            </div>
          </PanelBody>

          <PanelBody title={__('Stats cards', 'sage')} initialOpen={false}>
            {stats.map((item, index) => (
              <div key={`stat-control-${index}`} className="event-inspector-group">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {`${__('Card', 'sage')} ${index + 1}`}
                </p>
                <TextControl
                  label={__('Value', 'sage')}
                  value={item.value}
                  onChange={(value) => updateStat(index, 'value', value)}
                />
                <TextControl
                  label={__('Label', 'sage')}
                  value={item.label}
                  onChange={(label) => updateStat(index, 'label', label)}
                />
                <Button
                  variant="secondary"
                  isDestructive
                  onClick={() => removeStat(index)}
                  disabled={stats.length <= 1}
                >
                  {__('Remove card', 'sage')}
                </Button>
              </div>
            ))}

            <div className="mt-4">
              <Button variant="primary" onClick={addStat}>
                {__('Add card', 'sage')}
              </Button>
            </div>
          </PanelBody>
        </InspectorControls>

        <AboutSpotlightContent attributes={attributes} />
      </section>
    );
  },
  save({ attributes }) {
    const blockProps = useBlockProps.save({ className: 'alignfull' });
    return (
      <section {...blockProps}>
        <AboutSpotlightContent attributes={attributes} />
      </section>
    );
  },
});
