/**
 * MAGIC FINGER - GLOBAL CORE JAVASCRIPT
 * Header scroll state, mobile navigation drawer, scroll reveal observer,
 * active link detection, modal dispatch form, menu filters, lightbox zoom & toast notifications.
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
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
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

  // 5. Interactive Filter Tabs (for Dish / Deliverable Cards)
  const filterBtns = document.querySelectorAll('.menu-filter-nav .filter-btn');
  const dishCards = document.querySelectorAll('.dish-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filterValue = btn.getAttribute('data-filter');

      dishCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = '';
          card.classList.add('is-revealed');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Project Quote / Scope Modal
  const modalBackdrop = document.querySelector('#reservationModal');
  const openModalBtns = document.querySelectorAll('.js-open-reservation');
  const closeModalBtns = document.querySelectorAll('.js-close-reservation');
  const quoteServiceSelect = document.querySelector('#quoteService');

  function openModal(presetService = '') {
    if (!modalBackdrop) return;
    if (presetService && quoteServiceSelect) {
      for (let i = 0; i < quoteServiceSelect.options.length; i++) {
        if (quoteServiceSelect.options[i].text.toLowerCase().includes(presetService.toLowerCase()) ||
            presetService.toLowerCase().includes(quoteServiceSelect.options[i].text.toLowerCase())) {
          quoteServiceSelect.selectedIndex = i;
          break;
        }
      }
    }
    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preset = btn.getAttribute('data-service-preset') || '';
      openModal(preset);
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // 7. Proof Lightbox Modal
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.querySelector('.lightbox-caption-title');
  const lightboxDesc = document.querySelector('.lightbox-caption-desc');
  const lightboxCloseBtn = document.querySelector('.lightbox-close-btn');

  function openLightbox(src, title, desc) {
    if (!lightboxModal) return;
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxTitle) lightboxTitle.textContent = title || 'Verified Production Deliverable';
    if (lightboxDesc) lightboxDesc.textContent = desc || '100% authentic in-site / in-game production screenshot.';
    lightboxModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.js-lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const img = trigger.querySelector('img') || trigger;
      const src = trigger.getAttribute('data-full-img') || img.src;
      const title = trigger.getAttribute('data-title') || img.alt || 'Production Deliverable';
      const desc = trigger.getAttribute('data-desc') || '100% authentic in-site / in-game production screenshot by Magic Finger.';
      openLightbox(src, title, desc);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeModal();
      closeLightbox();
    }
  });

  // 8. Form Submissions with Toast
  const proposalForm = document.querySelector('#projectProposalForm');
  if (proposalForm) {
    proposalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('Proposal Dispatched', 'Your project request has been sent directly to Magic Finger! We reply within 2 hours.');
      proposalForm.reset();
    });
  }

  const contactPageForm = document.querySelector('#contactPageForm');
  if (contactPageForm) {
    contactPageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message Sent', 'Thank you! Magic Finger will review your project requirements and follow up promptly.');
      contactPageForm.reset();
    });
  }

  // 9. Global Toast Notification System
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#27C93F" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2.5 2.5L16 9" />
        </svg>
      </div>
      <div class="toast-content">
        <h5 style="color: #FFFFFF; font-size: 0.95rem; margin-bottom: 0.2rem;">${title}</h5>
        <p style="color: var(--color-cream-muted); font-size: 0.85rem;">${message}</p>
      </div>
    `;

    container.appendChild(toast);

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
