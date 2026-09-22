// Kuzzy Kitchen - Contact Form Handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contactPageForm') || document.querySelector('.reservation-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your inquiry has been received.');
      form.reset();
    });
  }
});