/* ==========================================================================
   SLIDER REVOLUTION ANIMATION ENGINE CONTROLLER
   Manages slides, 3D mouse tilt parallax, progress indicators, and transitions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const sliderSection = document.querySelector('.hero-slider-section');
  if (!sliderSection) return;

  const slides = document.querySelectorAll('.slide');
  const bullets = document.querySelectorAll('.slider-bullet');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const currentCounter = document.querySelector('.slide-counter-current');
  const totalCounter = document.querySelector('.slide-counter-total');

  let currentSlide = 0;
  const totalSlides = slides.length;
  const slideDuration = 6000;
  let slideTimer = null;
  let isPaused = false;

  if (totalCounter) {
    totalCounter.textContent = totalSlides < 10 ? `0${totalSlides}` : totalSlides;
  }

  function showSlide(index) {
    // Wrap around
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;

    currentSlide = index;

    // Update slides
    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update bullets
    bullets.forEach((bullet, i) => {
      const progress = bullet.querySelector('.slider-bullet-progress');
      if (i === currentSlide) {
        bullet.classList.add('active');
        if (progress) {
          progress.style.animation = 'none';
          void progress.offsetWidth; // Trigger reflow
          progress.style.animation = `bulletProgress ${slideDuration}ms linear forwards`;
        }
      } else {
        bullet.classList.remove('active');
        if (progress) {
          progress.style.animation = 'none';
        }
      }
    });

    // Update counter
    if (currentCounter) {
      currentCounter.textContent = currentSlide + 1 < 10 ? `0${currentSlide + 1}` : currentSlide + 1;
    }

    resetAutoPlay();
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (!isPaused) {
      slideTimer = setTimeout(() => {
        nextSlide();
      }, slideDuration);
    }
  }

  function stopAutoPlay() {
    if (slideTimer) {
      clearTimeout(slideTimer);
      slideTimer = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Event Listeners for Controls
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
    });
  }

  bullets.forEach((bullet) => {
    bullet.addEventListener('click', () => {
      const targetIndex = parseInt(bullet.getAttribute('data-slide'), 10);
      if (!isNaN(targetIndex)) {
        showSlide(targetIndex);
      }
    });
  });

  // Pause on hover
  sliderSection.addEventListener('mouseenter', () => {
    isPaused = true;
    stopAutoPlay();
  });

  sliderSection.addEventListener('mouseleave', () => {
    isPaused = false;
    startAutoPlay();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  sliderSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sliderSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // 3D Parallax Mouse Tilt for HUD box
  const hudBoxes = document.querySelectorAll('.hud-interactive-box');
  sliderSection.addEventListener('mousemove', (e) => {
    const rect = sliderSection.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 16;
    const rotY = (x / rect.width) * 16;

    hudBoxes.forEach(box => {
      box.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
    });
  });

  sliderSection.addEventListener('mouseleave', () => {
    hudBoxes.forEach(box => {
      box.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    });
  });

  // Initialize
  showSlide(0);
});
