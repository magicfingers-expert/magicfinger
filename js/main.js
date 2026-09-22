/**
 * KUZZY KITCHEN - GLOBAL CORE JAVASCRIPT
 * Header scroll state, mobile navigation drawer, scroll reveal observer,
 * active link detection, toast notifications, and utility helpers.
 */

(function () {
  'use strict';

  // 1. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Mobile Navigation Drawer
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileDrawer || !mobileOverlay || !mobileToggle) return;
    mobileToggle.classList.add('is-active');
    mobileDrawer.classList.add('is-open');
    mobileOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!mobileDrawer || !mobileOverlay || !mobileToggle) return;
    mobileToggle.classList.remove('is-active');
    mobileDrawer.classList.remove('is-open');
    mobileOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // 3. Scroll Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if observer not supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 4. Highlight Active Navigation Item Based on URL
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (
      (currentPath.endsWith('/') && (href === 'index.html' || href === './' || href === '/')) ||
      (currentPath.includes(href) && href !== 'index.html' && href !== './') ||
      (currentPath.endsWith('index.html') && (href === 'index.html' || href === './'))
    ) {
      link.classList.add('active');
    }
  });

  // 5. Global Toast Notification System
  window.showToast = function (title, message, duration = 4500) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2.5 2.5L16 9" />
        </svg>
      </div>
      <div class="toast-content">
        <h5>${title}</h5>
        <p>${message}</p>
      </div>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 400);
    }, duration);
  };

})();
