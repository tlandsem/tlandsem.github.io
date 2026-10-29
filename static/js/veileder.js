// KI i barnehagen: åpner og lukker kapittelmenyen på mobil.
(function () {
  var btn = document.getElementById('menu-btn');
  var menu = document.getElementById('sidemeny');
  if (!btn || !menu) return;

  function settApen(apen) {
    menu.classList.toggle('open', apen);
    btn.setAttribute('aria-expanded', apen ? 'true' : 'false');
  }

  btn.addEventListener('click', function () {
    settApen(!menu.classList.contains('open'));
  });

  // Lukk menyen når man velger en lenke eller trykker Escape
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) settApen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') settApen(false);
  });
})();
