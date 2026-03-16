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

const normalizeCards = (cards = []) => {
  const base = cards.length ? cards : metadata.attributes.cards.default;

  return base.map((card) => ({
    projectTitle: card?.projectTitle || '',
    description: card?.description || '',
    location: card?.location || '',
    season: card?.season || '',
    capacity: card?.capacity || '',
    buttonText: card?.buttonText || '',
    buttonUrl: card?.buttonUrl || '#',
    imageId: Number(card?.imageId || 0),
    imageUrl: card?.imageUrl || '',
    imageAlt: card?.imageAlt || '',
  }));
};

const MetaIconLocation = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="event-featured-work__meta-icon">
    <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const MetaIconCalendar = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="event-featured-work__meta-icon">
    <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 3v4m8-4v4M3 10h18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const MetaIconPeople = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="event-featured-work__meta-icon">
    <circle cx="8" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="16" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 20a5 5 0 0 1 10 0M13.5 20a4 4 0 0 1 7 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const FeaturedWorkCard = ({ card }) => (
  <article className="event-featured-work__card">
    <div className="event-featured-work__media" aria-hidden="true">
      {card.imageUrl ? (
        <img src={card.imageUrl} alt={card.imageAlt || ''} className="event-featured-work__image" />
      ) : (
        <div className="event-featured-work__image event-featured-work__image--fallback" />
      )}
    </div>

    <div className="event-featured-work__overlay" aria-hidden="true" />

    <div className="event-featured-work__content">
      <h3>{card.projectTitle}</h3>
      <p>{card.description}</p>

      <ul className="event-featured-work__meta" aria-label={__('Project details', 'sage')}>
        <li><MetaIconLocation />{card.location}</li>
        <li><MetaIconCalendar />{card.season}</li>
        <li><MetaIconPeople />{card.capacity}</li>
      </ul>

      <div className="event-featured-work__button-wrap">
        <a href={card.buttonUrl || '#'} className="event-featured-work__button">
          <span>{card.buttonText}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </article>
);

const FeaturedWorkContent = ({ attributes }) => {
  const cards = normalizeCards(attributes.cards);

  return (
    <section className="event-featured-work event-section-container py-14 md:py-24" id="featured-work" data-featured-work>
      <header className="mx-auto max-w-5xl text-center">
        <span className="event-featured-work__badge">{attributes.badge}</span>
        <h2 className="event-featured-work__title">
          <span>{attributes.titleLineOne}</span>
          <span className="event-featured-work__title-gradient">{attributes.titleLineTwo}</span>
        </h2>
      </header>

      <div className="event-featured-work__carousel">
        <button type="button" className="event-featured-work__arrow event-featured-work__arrow--prev" data-featured-work-prev aria-label={__('Previous card', 'sage')}>
          <span aria-hidden="true">←</span>
        </button>

        <div className="event-featured-work__viewport">
          <div className="event-featured-work__track" data-featured-work-track>
            {cards.map((card, index) => (
              <div key={`featured-card-${index}`} className="event-featured-work__slide">
                <FeaturedWorkCard card={card} />
              </div>
            ))}
          </div>
        </div>

        <button type="button" className="event-featured-work__arrow event-featured-work__arrow--next" data-featured-work-next aria-label={__('Next card', 'sage')}>
          <span aria-hidden="true">→</span>
        </button>
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
            </div>
          </PanelBody>

          <PanelBody title={__('Cards', 'sage')} initialOpen={false}>
            {cards.map((card, index) => (
              <div key={`featured-card-control-${index}`} className="event-inspector-group">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {`${__('Card', 'sage')} ${index + 1}`}
                </p>
                <TextControl label={__('Project title', 'sage')} value={card.projectTitle} onChange={(value) => updateCard(index, 'projectTitle', value)} />
                <TextareaControl label={__('Description', 'sage')} value={card.description} onChange={(value) => updateCard(index, 'description', value)} />
                <TextControl label={__('Location', 'sage')} value={card.location} onChange={(value) => updateCard(index, 'location', value)} />
                <TextControl label={__('Date/season', 'sage')} value={card.season} onChange={(value) => updateCard(index, 'season', value)} />
                <TextControl label={__('Audience', 'sage')} value={card.capacity} onChange={(value) => updateCard(index, 'capacity', value)} />
                <TextControl label={__('Button text', 'sage')} value={card.buttonText} onChange={(value) => updateCard(index, 'buttonText', value)} />
                <TextControl label={__('Button URL', 'sage')} value={card.buttonUrl} onChange={(value) => updateCard(index, 'buttonUrl', value)} />

                <MediaUploadCheck>
                  <MediaUpload
                    onSelect={(media) => {
                      const next = rawCards.map((rawCard, i) => (
                        i === index
                          ? {
                            ...rawCard,
                            imageId: media?.id || 0,
                            imageUrl: media?.url || '',
                            imageAlt: media?.alt || '',
                          }
                          : rawCard
                      ));
                      setCards(next);
                    }}
                    allowedTypes={['image']}
                    value={card.imageId || 0}
                    render={({ open }) => (
                      <Button variant="secondary" onClick={open}>
                        {card.imageUrl ? __('Replace image', 'sage') : __('Choose image', 'sage')}
                      </Button>
                    )}
                  />
                </MediaUploadCheck>

                {card.imageUrl ? (
                  <>
                    <img
                      src={card.imageUrl}
                      alt=""
                      style={{
                        width: '100%',
                        maxWidth: '320px',
                        borderRadius: '12px',
                        border: '1px solid #27272a',
                      }}
                    />
                    <TextControl
                      label={__('Image alt text', 'sage')}
                      value={card.imageAlt}
                      onChange={(value) => updateCard(index, 'imageAlt', value)}
                    />
                    <Button
                      variant="secondary"
                      isDestructive
                      onClick={() => {
                        const next = rawCards.map((rawCard, i) => (
                          i === index
                            ? { ...rawCard, imageId: 0, imageUrl: '', imageAlt: '' }
                            : rawCard
                        ));
                        setCards(next);
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
                onClick={() => setCards([
                  ...cards,
                  {
                    projectTitle: 'New Production',
                    description: 'Describe the production.',
                    location: 'City, Country',
                    season: 'Season Year',
                    capacity: '0+',
                    buttonText: 'View Case Study',
                    buttonUrl: '#',
                    imageId: 0,
                    imageUrl: '',
                    imageAlt: '',
                  },
                ])}
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

        <FeaturedWorkContent attributes={attributes} />
      </section>
    );
  },
  save({ attributes }) {
    const blockProps = useBlockProps.save({ className: 'alignfull' });
    return (
      <section {...blockProps}>
        <FeaturedWorkContent attributes={attributes} />
      </section>
    );
  },
});
