// Kuzzy Kitchen - Menu Filter Module
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.menu-filter-nav .filter-btn');
  const dishCards = document.querySelectorAll('.dish-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const val = btn.getAttribute('data-filter');
      dishCards.forEach(c => {
        if (val === 'all' || c.getAttribute('data-category') === val) {
          c.style.display = '';
          c.classList.add('is-revealed');
        } else {
          c.style.display = 'none';
        }
      });
    });
  });
});