import domReady from '@wordpress/dom-ready';
import '../blocks/about-spotlight/index.jsx';
import '../blocks/by-the-numbers/index.jsx';
import '../blocks/contact-section/index.jsx';
import '../blocks/featured-work/index.jsx';
import '../blocks/hero/index.jsx';
import '../blocks/services-grid/index.jsx';
import '../blocks/services-showcase/index.jsx';
import '../blocks/story-split/index.jsx';
import '../blocks/technology-grid/index.jsx';
import '../blocks/visual-highlights/index.jsx';

domReady(() => {
  document.body.classList.add('event-block-editor');
});
