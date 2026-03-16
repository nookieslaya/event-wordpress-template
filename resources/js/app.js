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

const initGlobalCursorFollower = () => {
  if (!window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  const follower = document.createElement('span');
  follower.className = 'event-global-cursor';
  follower.setAttribute('aria-hidden', 'true');
  document.body.appendChild(follower);

  let active = false;
  let frame = 0;
  let targetX = window.innerWidth * 0.5;
  let targetY = window.innerHeight * 0.5;
  let currentX = targetX;
  let currentY = targetY;
  let hiddenBySpotlight = false;

  const render = () => {
    frame = 0;
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    follower.style.left = `${currentX}px`;
    follower.style.top = `${currentY}px`;

    if (
      active
      || Math.abs(targetX - currentX) > 0.2
      || Math.abs(targetY - currentY) > 0.2
    ) {
      frame = requestAnimationFrame(render);
    }
  };

  const queue = () => {
    if (!frame) {
      frame = requestAnimationFrame(render);
    }
  };

  document.addEventListener('mousemove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    active = true;

    hiddenBySpotlight = Boolean(event.target?.closest?.('[data-about-spotlight]'));
    follower.classList.toggle('is-visible', !hiddenBySpotlight);
    queue();
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    active = false;
    follower.classList.remove('is-visible');
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

const initExpertiseSection = () => {
  const sections = Array.from(document.querySelectorAll('.event-expertise-section'));

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
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15,
  });

  sections.forEach((section) => observer.observe(section));
};

const initAboutSpotlight = () => {
  const sections = Array.from(document.querySelectorAll('[data-about-spotlight]'));

  if (!sections.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'));
  } else {
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
      threshold: 0.15,
    });

    sections.forEach((section) => observer.observe(section));
  }

  sections.forEach((section) => {
    const cursor = section.querySelector('.event-about-spotlight__cursor');
    if (!cursor) {
      return;
    }

    let active = false;
    let frame = 0;
    let targetX = section.clientWidth * 0.72;
    let targetY = section.clientHeight * 0.28;
    let currentX = targetX;
    let currentY = targetY;

    const render = () => {
      frame = 0;
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      section.style.setProperty('--spot-x', `${currentX}px`);
      section.style.setProperty('--spot-y', `${currentY}px`);

      if (
        active
        || Math.abs(targetX - currentX) > 0.3
        || Math.abs(targetY - currentY) > 0.3
      ) {
        frame = requestAnimationFrame(render);
      }
    };

    const queueRender = () => {
      if (!frame) {
        frame = requestAnimationFrame(render);
      }
    };

    const updateTarget = (clientX, clientY) => {
      const rect = section.getBoundingClientRect();
      targetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      targetY = Math.max(0, Math.min(rect.height, clientY - rect.top));
      queueRender();
    };

    section.addEventListener('mouseenter', () => {
      active = true;
      section.classList.add('is-active');
      queueRender();
    });

    section.addEventListener('mouseleave', () => {
      active = false;
      section.classList.remove('is-active');
      queueRender();
    });

    section.addEventListener('mousemove', (event) => {
      updateTarget(event.clientX, event.clientY);
    });

    section.addEventListener('touchmove', (event) => {
      const touch = event.touches?.[0];
      if (!touch) {
        return;
      }
      updateTarget(touch.clientX, touch.clientY);
    }, { passive: true });

    section.addEventListener('touchstart', (event) => {
      const touch = event.touches?.[0];
      if (!touch) {
        return;
      }

      active = true;
      section.classList.add('is-active');
      updateTarget(touch.clientX, touch.clientY);
    }, { passive: true });

    document.addEventListener('touchstart', (event) => {
      if (section.contains(event.target)) {
        return;
      }

      active = false;
      section.classList.remove('is-active');
      queueRender();
    }, { passive: true });
  });
};

const initServicesShowcase = () => {
  const sections = Array.from(document.querySelectorAll('.event-services-showcase'));

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
    threshold: 0.15,
  });

  sections.forEach((section) => observer.observe(section));
};

const initTechnologyGrid = () => {
  const sections = Array.from(document.querySelectorAll('[data-technology-grid]'));

  if (!sections.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'));
  } else {
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
      threshold: 0.15,
    });

    sections.forEach((section) => observer.observe(section));
  }

  sections.forEach((section) => {
    const updatePointerLight = (clientX, clientY) => {
      const rect = section.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
      section.style.setProperty('--tech-x', `${x}px`);
      section.style.setProperty('--tech-y', `${y}px`);
    };

    section.addEventListener('mousemove', (event) => {
      updatePointerLight(event.clientX, event.clientY);
    });

    section.addEventListener('mouseenter', () => {
      section.classList.add('is-card-hovered');
    });

    section.addEventListener('mouseleave', () => {
      section.style.setProperty('--tech-x', '50%');
      section.style.setProperty('--tech-y', '28%');
      section.style.setProperty('--tech-accent-rgb', '59 130 246');
      section.classList.remove('is-card-hovered');
    });

    section.querySelectorAll('[data-card-accent]').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const accent = card.getAttribute('data-card-accent') || '59 130 246';
        section.style.setProperty('--tech-accent-rgb', accent);
      });
    });
  });
};

const initFeaturedWorkCarousel = () => {
  const sections = Array.from(document.querySelectorAll('[data-featured-work]'));

  if (!sections.length) {
    return;
  }

  sections.forEach((section) => {
    const track = section.querySelector('[data-featured-work-track]');
    const prevButton = section.querySelector('[data-featured-work-prev]');
    const nextButton = section.querySelector('[data-featured-work-next]');
    const slides = Array.from(section.querySelectorAll('.event-featured-work__slide'));

    if (!track || !prevButton || !nextButton || slides.length <= 1) {
      if (prevButton) {
        prevButton.disabled = true;
      }
      if (nextButton) {
        nextButton.disabled = true;
      }
      return;
    }

    let index = 0;

    const update = () => {
      track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
      prevButton.disabled = index === 0;
      nextButton.disabled = index === slides.length - 1;
    };

    prevButton.addEventListener('click', () => {
      index = Math.max(index - 1, 0);
      update();
    });

    nextButton.addEventListener('click', () => {
      index = Math.min(index + 1, slides.length - 1);
      update();
    });

    update();
  });
};

const initByNumbersCounters = () => {
  const sections = Array.from(document.querySelectorAll('.event-by-numbers'));

  if (!sections.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateValue = (element) => {
    const raw = (element.textContent || '').trim();
    const match = raw.match(/[\d.,]+/);

    if (!match) {
      return;
    }

    const numericRaw = match[0];
    const target = Number(numericRaw.replace(/,/g, ''));
    if (Number.isNaN(target)) {
      return;
    }

    const suffix = raw.slice(match.index + numericRaw.length);
    const hasDecimals = numericRaw.includes('.');
    const duration = 1300;
    const startTime = performance.now();

    const format = (value) => {
      const fixedValue = hasDecimals ? value.toFixed(1) : Math.round(value).toString();
      const parts = fixedValue.split('.');
      parts[0] = Number(parts[0]).toLocaleString('en-US');
      return hasDecimals ? `${parts[0]}.${parts[1]}` : parts[0];
    };

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - ((1 - progress) ** 3);
      const current = target * eased;

      element.textContent = `${format(current)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = raw;
      }
    };

    requestAnimationFrame(tick);
  };

  const run = (section) => {
    section.querySelectorAll('.event-by-numbers__value').forEach((valueElement) => {
      animateValue(valueElement);
    });
  };

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    sections.forEach((section) => run(section));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      run(entry.target);
      currentObserver.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.25,
  });

  sections.forEach((section) => observer.observe(section));
};

const initVisualHighlightsLightbox = () => {
  const cards = Array.from(document.querySelectorAll('[data-vh-item][data-vh-image]'));

  if (!cards.length) {
    return;
  }

  const lightbox = document.createElement('div');
  lightbox.className = 'event-vh-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <button type="button" class="event-vh-lightbox__backdrop" aria-label="Close lightbox"></button>
    <div class="event-vh-lightbox__inner" role="dialog" aria-modal="true" aria-label="Image preview">
      <button type="button" class="event-vh-lightbox__close" aria-label="Close lightbox">&times;</button>
      <img class="event-vh-lightbox__image" alt="" />
    </div>
  `;

  document.body.appendChild(lightbox);

  const image = lightbox.querySelector('.event-vh-lightbox__image');
  const closeButton = lightbox.querySelector('.event-vh-lightbox__close');
  const backdrop = lightbox.querySelector('.event-vh-lightbox__backdrop');
  let previouslyFocused = null;

  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('overflow-hidden');
    document.body.classList.remove('overflow-hidden');
    image.removeAttribute('src');
    image.setAttribute('alt', '');
    previouslyFocused?.focus?.();
  };

  const open = (src, alt = '') => {
    if (!src || !image) {
      return;
    }

    previouslyFocused = document.activeElement;
    image.setAttribute('src', src);
    image.setAttribute('alt', alt);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('overflow-hidden');
    document.body.classList.add('overflow-hidden');
    closeButton?.focus?.();
  };

  cards.forEach((card) => {
    const trigger = card.querySelector('.event-vh-card__open');
    const src = card.getAttribute('data-vh-image');
    const alt = card.getAttribute('data-vh-alt') || '';

    if (!trigger || !src) {
      return;
    }

    trigger.addEventListener('click', () => open(src, alt));
  });

  closeButton?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      close();
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderBehavior();
    initMobileMenu();
    initGlobalCursorFollower();
    initHeroBlocks();
    initStorySplit();
    initExpertiseSection();
    initAboutSpotlight();
    initServicesShowcase();
    initTechnologyGrid();
    initFeaturedWorkCarousel();
    initByNumbersCounters();
    initVisualHighlightsLightbox();
  });
} else {
  initHeaderBehavior();
  initMobileMenu();
  initGlobalCursorFollower();
  initHeroBlocks();
  initStorySplit();
  initExpertiseSection();
  initAboutSpotlight();
  initServicesShowcase();
  initTechnologyGrid();
  initFeaturedWorkCarousel();
  initByNumbersCounters();
  initVisualHighlightsLightbox();
}
