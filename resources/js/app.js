import.meta.glob([
  '../images/**',
  '../fonts/**',
]);

const initHeaderBehavior = () => {
  const header = document.querySelector('.event-header');

  if (!header) {
    return;
  }

  requestAnimationFrame(() => {
    header.classList.add('is-ready');
  });

  const updateScrollState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
};

const initMobileMenu = () => {
  const panel = document.querySelector('[data-mobile-menu-panel]');
  const openButton = document.querySelector('[data-mobile-menu-open]');
  const closeButton = document.querySelector('[data-mobile-menu-close]');

  if (!panel || !openButton || !closeButton) {
    return;
  }

  const setOpen = (isOpen) => {
    panel.classList.toggle('hidden', !isOpen);
    openButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.documentElement.classList.toggle('overflow-hidden', isOpen);
    document.body.classList.toggle('overflow-hidden', isOpen);
  };

  openButton.addEventListener('click', () => setOpen(true));
  closeButton.addEventListener('click', () => setOpen(false));

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  });
};

const initHeroBlocks = () => {
  const heroes = Array.from(document.querySelectorAll('.event-hero'));

  heroes.forEach((hero) => {
    requestAnimationFrame(() => {
      hero.classList.add('is-ready');
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderBehavior();
    initMobileMenu();
    initHeroBlocks();
  });
} else {
  initHeaderBehavior();
  initMobileMenu();
  initHeroBlocks();
}
