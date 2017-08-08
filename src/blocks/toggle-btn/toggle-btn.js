var headerSatus = document.querySelector('.header');
var toggleBtn = document.querySelector('.toggle-menu');

toggleBtn.addEventListener('click', function() {
  if (headerSatus.classList.contains('header--opened')) {
    headerSatus.classList.add('header--closed');
    headerSatus.classList.remove('header--opened');
  } else {
    headerSatus.classList.add('header--opened');
    headerSatus.classList.remove('header--closed');
  }
});