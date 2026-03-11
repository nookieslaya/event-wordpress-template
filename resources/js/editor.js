import domReady from '@wordpress/dom-ready';
import '../blocks/hero/index.jsx';
import '../blocks/services-grid/index.jsx';

domReady(() => {
  document.body.classList.add('event-block-editor');
});
