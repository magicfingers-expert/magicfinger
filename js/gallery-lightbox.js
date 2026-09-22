// Kuzzy Kitchen - Lightbox Module
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.lightbox-modal');
  const triggers = document.querySelectorAll('.js-lightbox-trigger');
  triggers.forEach(t => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('is-active');
    });
  });
});