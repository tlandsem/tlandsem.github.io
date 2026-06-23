fetch('nav.html')
  .then(r => r.text())
  .then(html => {
    const mount = document.getElementById('site-nav');
    if (!mount) return;
    mount.innerHTML = html;
    // marker gjeldende side som aktiv
    const here = location.pathname.split('/').pop() || 'index.html';
    mount.querySelectorAll('a').forEach(a => {
      if (a.getAttribute('href') === here) a.classList.add('active');
    });
  });
