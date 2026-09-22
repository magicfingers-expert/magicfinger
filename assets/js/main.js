/* ==========================================================================
   MAGIC FINGER - CORE INTERACTION JAVASCRIPT
   Navigation, stats counter, service filters, cost estimator, lightbox, contact
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.innerHTML = isOpen 
        ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
      });
    });
  }

  // 2. Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 3. Highlight Active Navigation Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 4. Animated Statistics Counter on Scroll
  const statNumbers = document.querySelectorAll('.stat-item-number');
  if (statNumbers.length > 0) {
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target') || '0');
            const suffix = stat.getAttribute('data-suffix') || '';
            const isFloat = target % 1 !== 0;
            const duration = 2000;
            const startTime = performance.now();

            function updateCount(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              const currentVal = easeProgress * target;

              stat.textContent = (isFloat ? currentVal.toFixed(1) : Math.floor(currentVal)) + suffix;

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                stat.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
              }
            }

            requestAnimationFrame(updateCount);
          });
        }
      });
    }, { threshold: 0.25 });

    const statsSection = document.querySelector('.stats-banner') || document.querySelector('.stats-grid');
    if (statsSection) observer.observe(statsSection);
  }

  // 5. Category Filter Tabs (on Services Page & Portfolio Gallery)
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  const filterCards = document.querySelectorAll('.service-vertical-card, .portfolio-card');

  if (filterTabs.length > 0 && filterCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.getAttribute('data-category');
        filterCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || (cardCat && cardCat.includes(category))) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease';
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Interactive Image Lightbox Modal for Screenshots
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-modal-img');
  const lightboxTitle = document.getElementById('lightbox-modal-title');
  const lightboxTag = document.getElementById('lightbox-modal-tag');
  const lightboxCloseBtn = document.querySelector('.lightbox-close-btn');

  if (lightboxModal) {
    document.querySelectorAll('.screenshot-preview-box, .portfolio-card').forEach(item => {
      item.addEventListener('click', (e) => {
        // Prevent opening if direct button or link was clicked
        if (e.target.closest('a') || e.target.closest('button')) return;

        const imgEl = item.querySelector('.screenshot-preview-img');
        const titleEl = item.querySelector('.portfolio-card-title, .profile-name, h3');
        const badgeEl = item.querySelector('.screenshot-badge, .profile-tagline');

        if (imgEl && lightboxImg) {
          lightboxImg.src = imgEl.src;
          if (lightboxTitle && titleEl) lightboxTitle.textContent = titleEl.textContent;
          if (lightboxTag && badgeEl) lightboxTag.textContent = badgeEl.textContent;

          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 7. Interactive Project Cost Estimator (on Services Page)
  const complexitySlider = document.getElementById('calc-complexity');
  const durationSlider = document.getElementById('calc-duration');
  const verticalSelect = document.getElementById('calc-vertical');
  const priceDisplay = document.getElementById('calc-price-output');
  const timelineDisplay = document.getElementById('calc-timeline-output');

  function calculateEstimate() {
    if (!complexitySlider || !durationSlider || !verticalSelect || !priceDisplay) return;

    const baseRates = {
      'ai': 280,
      'ecommerce': 220,
      'web': 180,
      'gaming': 120,
      'servers': 150,
      'uiux': 160
    };

    const selectedVertical = verticalSelect.value || 'ai';
    const complexity = parseInt(complexitySlider.value, 10) || 2;
    const isExpedited = durationSlider.value === '1';

    const basePrice = baseRates[selectedVertical] || 200;
    let finalPrice = basePrice * complexity;

    if (isExpedited) {
      finalPrice = Math.round(finalPrice * 1.4);
    }

    let days = complexity * 2;
    if (isExpedited) days = Math.max(1, Math.floor(days / 2));

    priceDisplay.textContent = `$${finalPrice.toLocaleString()}`;
    if (timelineDisplay) {
      timelineDisplay.textContent = isExpedited 
        ? `⚡ Fast Delivery (~${days} ${days === 1 ? 'day' : 'days'})` 
        : `Standard Turnaround (~${days} ${days === 1 ? 'day' : 'days'})`;
    }

    const complexityValLabel = document.getElementById('complexity-val-label');
    if (complexityValLabel) {
      const labels = ['Basic Task', 'Standard Build', 'Advanced Architecture', 'Enterprise Scale', 'Full Custom Ecosystem'];
      complexityValLabel.textContent = labels[complexity - 1] || `Tier ${complexity}`;
    }
  }

  if (complexitySlider) complexitySlider.addEventListener('input', calculateEstimate);
  if (durationSlider) durationSlider.addEventListener('input', calculateEstimate);
  if (verticalSelect) verticalSelect.addEventListener('change', calculateEstimate);
  calculateEstimate();

  // 8. FAQ Accordions
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(f => f.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 9. Contact Form Handler with Cyber Toast Feedback
  const contactForm = document.getElementById('contact-form-dispatch');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10"/>
        </svg>
        Transmitting Signal...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('Signal Transmitted! Magic Finger will reply to your email shortly.');
      }, 1200);
    });
  }

  // Toast Notification Helper
  function showToast(message) {
    let toast = document.querySelector('.toast-cyber');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-cyber';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>${message}</span>
    `;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
});
