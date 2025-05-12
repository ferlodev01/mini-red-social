const btnToggle = document.getElementById('btn-toggle-menu');
const sidebar   = document.getElementById('sidebar');

btnToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});
