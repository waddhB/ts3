document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
      if (check.checked) {
        check.checked = false;
      }
    });
  });
  document.addEventListener('click', (e) => {
    const icons = document.querySelector('.icons');
    if (
      window.innerWidth <= 992 &&
      check.checked &&
      !icons.contains(e.target) &&
      !navbar.contains(e.target)
    ) {
      check.checked = false;
    }
  });
});
