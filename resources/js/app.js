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

const initStorySplit = () => {
  const sections = Array.from(document.querySelectorAll('.event-story-split'));

  if (!sections.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.2,
  });

  sections.forEach((section) => observer.observe(section));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderBehavior();
    initMobileMenu();
    initHeroBlocks();
    initStorySplit();
  });
} else {
  initHeaderBehavior();
  initMobileMenu();
  initHeroBlocks();
  initStorySplit();
}
