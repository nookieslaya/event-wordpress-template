import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import metadata from './block.json';

const normalizeMetrics = (metrics = []) => {
  const base = metrics.length ? metrics : metadata.attributes.metrics.default;

  return base.map((item) => ({
    value: item?.value || '',
    label: item?.label || '',
    colorFrom: item?.colorFrom || '#a855f7',
    colorTo: item?.colorTo || '#6366f1',
  }));
};

const ByNumbersContent = ({ attributes }) => {
  const metrics = normalizeMetrics(attributes.metrics);

  return (
    <section className="event-by-numbers event-section-container py-14 md:py-24" id="by-the-numbers">
      <header className="mx-auto max-w-5xl text-center">
        <span className="event-by-numbers__badge">{attributes.badge}</span>
        <h2 className="event-by-numbers__title">
          <span>{attributes.titleLineOne}</span>
          <span className="event-by-numbers__title-gradient">{attributes.titleLineTwo}</span>
        </h2>
      </header>

      <div className="event-by-numbers__grid">
        {metrics.map((metric, index) => (
          <article key={`metric-${index}`} className="event-by-numbers__item">
            <strong
              className="event-by-numbers__value"
              style={{
                backgroundImage: `linear-gradient(90deg, ${metric.colorFrom}, ${metric.colorTo})`,
              }}
            >
              {metric.value}
            </strong>
            <span className="event-by-numbers__label">{metric.label}</span>
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
    const metrics = normalizeMetrics(attributes.metrics);
    const rawMetrics = attributes.metrics?.length ? attributes.metrics : metadata.attributes.metrics.default;

    const setMetrics = (next) => setAttributes({ metrics: next });

    const updateMetric = (index, key, value) => {
      const next = rawMetrics.map((item, i) => (i === index ? { ...item, [key]: value } : item));
      setMetrics(next);
    };

    return (
      <section {...blockProps}>
        <InspectorControls>
          <PanelBody title={__('Section', 'sage')} initialOpen>
            <div className="event-inspector-group">
              <TextControl
                label={__('Badge', 'sage')}
                value={attributes.badge}
                onChange={(badge) => setAttributes({ badge })}
              />
              <TextControl
                label={__('Title line 1', 'sage')}
                value={attributes.titleLineOne}
                onChange={(titleLineOne) => setAttributes({ titleLineOne })}
              />
              <TextControl
                label={__('Title line 2', 'sage')}
                value={attributes.titleLineTwo}
                onChange={(titleLineTwo) => setAttributes({ titleLineTwo })}
              />
            </div>
          </PanelBody>

          <PanelBody title={__('Metrics', 'sage')} initialOpen={false}>
            {metrics.map((metric, index) => (
              <div key={`metric-control-${index}`} className="event-inspector-group">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {`${__('Metric', 'sage')} ${index + 1}`}
                </p>
                <TextControl
                  label={__('Value', 'sage')}
                  value={metric.value}
                  onChange={(value) => updateMetric(index, 'value', value)}
                />
                <TextControl
                  label={__('Label', 'sage')}
                  value={metric.label}
                  onChange={(label) => updateMetric(index, 'label', label)}
                />
                <TextControl
                  label={__('Gradient start (hex)', 'sage')}
                  value={metric.colorFrom}
                  onChange={(colorFrom) => updateMetric(index, 'colorFrom', colorFrom)}
                />
                <TextControl
                  label={__('Gradient end (hex)', 'sage')}
                  value={metric.colorTo}
                  onChange={(colorTo) => updateMetric(index, 'colorTo', colorTo)}
                />
              </div>
            ))}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() => setMetrics([
                  ...metrics,
                  { value: '0+', label: 'New Metric', colorFrom: '#a855f7', colorTo: '#6366f1' },
                ])}
              >
                {__('Add metric', 'sage')}
              </Button>
              <Button
                variant="secondary"
                isDestructive
                onClick={() => metrics.length > 1 && setMetrics(metrics.slice(0, -1))}
                disabled={metrics.length <= 1}
              >
                {__('Remove last', 'sage')}
              </Button>
            </div>
          </PanelBody>
        </InspectorControls>

        <ByNumbersContent attributes={attributes} />
      </section>
    );
  },
  save({ attributes }) {
    const blockProps = useBlockProps.save({ className: 'alignfull' });
    return (
      <section {...blockProps}>
        <ByNumbersContent attributes={attributes} />
      </section>
    );
  },
});
