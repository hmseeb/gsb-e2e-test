/**
 * Ember Roasters – Main JavaScript
 * Handles: sticky header, mobile nav, scroll reveal animations
 */

(function () {
  'use strict';

  /* ── Sticky Header ─────────────────────────────────────── */
  const header = document.getElementById('site-header');

  function updateHeader() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // run on load

  /* ── Mobile Navigation ─────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  function openNav() {
    navMenu.classList.add('open');
    overlay.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navMenu.classList.remove('open');
    overlay.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  overlay.addEventListener('click', closeNav);

  // Close nav when a link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeNav();
      navToggle.focus();
    }
  });

  // Close nav if viewport widens past mobile breakpoint
  const mediaQuery = window.matchMedia('(min-width: 769px)');
  mediaQuery.addEventListener('change', function (e) {
    if (e.matches) {
      closeNav();
    }
  });

  /* ── Scroll Reveal ─────────────────────────────────────── */
  // Add reveal class to elements that should animate in
  const revealTargets = [
    { selector: '.section-header',  delay: '' },
    { selector: '.drink-card',      delay: true },
    { selector: '.about-visual',    delay: '' },
    { selector: '.about-content',   delay: '' },
    { selector: '.about-text',      delay: true },
    { selector: '.about-stats',     delay: '' },
    { selector: '.footer-brand',    delay: '' },
    { selector: '.footer-section',  delay: true },
  ];

  revealTargets.forEach(function (target) {
    const elements = document.querySelectorAll(target.selector);
    elements.forEach(function (el, i) {
      el.classList.add('reveal');
      if (target.delay) {
        const delayClass = 'reveal-delay-' + Math.min(i + 1, 6);
        el.classList.add(delayClass);
      }
    });
  });

  // IntersectionObserver for reveal
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Active Nav Link on Scroll ─────────────────────────── */
  const sections = document.querySelectorAll('main section[id], footer[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function getActiveSection() {
    const scrollPos = window.scrollY + var(--header-height, 80) + 60;
    let activeId = '';

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        activeId = section.id;
      }
    });

    return activeId;
  }

  // Fix: plain JS version without CSS var
  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    let activeId = '';

    sections.forEach(function (section) {
      const top = section.offsetTop;
      if (scrollPos >= top) {
        activeId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + activeId) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ── Smooth scroll polyfill for anchor links ───────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerOffset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '72',
        10
      );

      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Drink card hover enhancement ─────────────────────── */
  document.querySelectorAll('.drink-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      this.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', function () {
      this.style.willChange = '';
    });
  });

  /* ── Hero: subtle parallax on scroll ──────────────────── */
  const heroBg = document.querySelector('.hero-bg');

  if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    function heroParallax() {
      const scrolled = window.scrollY;
      const heroHeight = document.querySelector('.hero').offsetHeight;
      if (scrolled < heroHeight) {
        heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
      }
    }

    window.addEventListener('scroll', heroParallax, { passive: true });
  }

})();
