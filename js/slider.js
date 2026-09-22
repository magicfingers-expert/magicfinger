/**
 * KUZZY KITCHEN - CINEMATIC HERO SLIDER ENGINE
 * Slider Revolution inspired multi-slide carousel with Ken Burns zoom,
 * staggered layer animations, touch gestures, and progress indicators.
 */

class HeroSlider {
  constructor(containerSelector = '.hero-slider-section', options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.slides = Array.from(this.container.querySelectorAll('.slide'));
    this.dots = Array.from(this.container.querySelectorAll('.pagination-dot'));
    this.progressBar = this.container.querySelector('.slider-progress-bar');
    this.currentNumEl = this.container.querySelector('.current-num');
    this.totalNumEl = this.container.querySelector('.total-num');
    this.prevBtn = this.container.querySelector('.slider-arrow-prev');
    this.nextBtn = this.container.querySelector('.slider-arrow-next');

    this.options = Object.assign({
      duration: 6500,
      autoPlay: true,
      pauseOnHover: true
    }, options);

    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.timer = null;
    this.progressTimer = null;
    this.isPaused = false;
    this.isTransitioning = false;

    // Touch gesture tracking
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    if (this.totalSlides === 0) return;

    if (this.totalNumEl) {
      this.totalNumEl.textContent = `0${this.totalSlides}`;
    }

    this.bindEvents();
    this.goToSlide(0, false);
    
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && this.options.autoPlay) {
      this.startTimer();
    }
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.resetTimer();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.resetTimer();
      });
    }

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (index === this.currentIndex) return;
        this.goToSlide(index);
        this.resetTimer();
      });
    });

    if (this.options.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.pause());
      this.container.addEventListener('mouseleave', () => this.resume());
    }

    // Touch support
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });

    // Keyboard support when visible
    document.addEventListener('keydown', (e) => {
      if (!this.isElementInViewport(this.container)) return;
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
        this.resetTimer();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
        this.resetTimer();
      }
    });
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
      this.resetTimer();
    }
  }

  goToSlide(index, animateProgress = true) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Normalize index
    if (index < 0) index = this.totalSlides - 1;
    if (index >= this.totalSlides) index = 0;

    // Deactivate previous slide
    this.slides.forEach((slide, i) => {
      if (i !== index) {
        slide.classList.remove('is-active');
      }
    });

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    // Activate target slide
    const targetSlide = this.slides[index];
    targetSlide.classList.add('is-active');

    if (this.currentNumEl) {
      this.currentNumEl.textContent = `0${index + 1}`;
    }

    this.currentIndex = index;

    // Reset and start progress bar animation
    if (animateProgress && this.progressBar) {
      this.animateProgressBar();
    }

    setTimeout(() => {
      this.isTransitioning = false;
    }, 800);
  }

  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }

  animateProgressBar() {
    if (!this.progressBar) return;
    this.progressBar.style.transition = 'none';
    this.progressBar.style.width = '0%';

    // Force reflow
    void this.progressBar.offsetWidth;

    this.progressBar.style.transition = `width ${this.options.duration}ms linear`;
    this.progressBar.style.width = '100%';
  }

  startTimer() {
    this.stopTimer();
    this.animateProgressBar();
    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, this.options.duration);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.progressBar) {
      this.progressBar.style.transition = 'none';
      this.progressBar.style.width = '0%';
    }
  }

  resetTimer() {
    this.stopTimer();
    if (this.options.autoPlay && !this.isPaused) {
      this.startTimer();
    }
  }

  pause() {
    this.isPaused = true;
    if (this.progressBar) {
      const computedWidth = window.getComputedStyle(this.progressBar).width;
      this.progressBar.style.transition = 'none';
      this.progressBar.style.width = computedWidth;
    }
  }

  resume() {
    this.isPaused = false;
    this.resetTimer();
  }

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= -rect.height &&
      rect.bottom <= (window.innerHeight + rect.height)
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.kuzzySlider = new HeroSlider();
});
