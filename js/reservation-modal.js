// Kuzzy Kitchen - Reservation Modal Module
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('#reservationModal');
  const openBtns = document.querySelectorAll('.js-open-reservation');
  const closeBtns = document.querySelectorAll('.js-close-reservation');
  function open() { if (modal) modal.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function close() { if (modal) modal.classList.remove('is-open'); document.body.style.overflow = ''; }
  openBtns.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  closeBtns.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); close(); }));
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
});