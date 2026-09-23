// Viser TryHackMe-data fra static/data/thm.json (oppdateres automatisk hver natt av GitHub Actions).
// Bygger alt med createElement/textContent – aldri innerHTML – så data utenfra ikke kan injisere kode.
(function () {
  const root = document.getElementById('thm');
  if (!root) return;

  const BADGE_TITLES = { 'terminaled': 'cat linux.txt', 'ohsint': 'OhSINT' };
  const pretty = n => BADGE_TITLES[n] || n.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const CATEGORIES = [
    ['Linux', r => /linux fundamentals/i.test(r.title)],
    ['Defensive Security', r => /defensive|analyst/i.test(r.title) || r.tags.some(t => /incident response|security operations/i.test(t)) && !/career/i.test(r.title)],
    ['Offensive Security & Pentesting', r => /nmap|sql|metasploit|offensive|recon|dork|search skills|vulnerab|ohsint/i.test(r.title) || r.tags.some(t => /penetration|red teaming|exploit|osint/i.test(t)) && !/career/i.test(r.title)],
    ['Fundamentals', () => true],
  ];

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const safeImg = url => /^static\/images\/thm\/[a-z0-9-]+\.png$/.test(url) ? url : '';

  fetch('static/data/thm.json', { cache: 'no-cache' })
    .then(r => r.json())
    .then(d => {
      root.replaceChildren();

      const stats = el('div', 'thm-stats');
      [[d.completedRoomsNumber, 'Rooms completed'], [d.badgesNumber, 'Badges'], [d.rank, 'Global rank'], [d.level, 'Level']]
        .forEach(([v, l]) => { const s = el('div', 'thm-stat'); s.append(el('div', 'thm-stat-value', String(v)), el('div', 'thm-stat-label', l)); stats.append(s); });
      root.append(stats);

      const badges = d.badges.filter(b => !/streak|raffle/i.test(b.name)).sort((a, b) => b.earnedAt.localeCompare(a.earnedAt));
      if (badges.length) {
        root.append(el('div', 'thm-group', 'Badges'));
        const row = el('div', 'thm-badges');
        badges.forEach(b => {
          const card = el('div', 'thm-badge-mini');
          const img = el('img'); img.src = safeImg(b.image); img.alt = pretty(b.name) + ' badge'; img.loading = 'lazy';
          const date = new Date(b.earnedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
          card.append(img, el('div', 'cv-role', pretty(b.name)), el('div', 'thm-meta', 'Earned ' + date));
          row.append(card);
        });
        root.append(row);
      }

      const groups = new Map(CATEGORIES.map(([n]) => [n, []]));
      d.rooms.forEach(r => { const [name] = CATEGORIES.find(([, test]) => test(r)); groups.get(name).push(r); });
      groups.forEach((rooms, name) => {
        if (!rooms.length) return;
        root.append(el('div', 'thm-group', `${name} · ${rooms.length}`));
        const row = el('div', 'tag-row');
        rooms.forEach(r => {
          const a = el('a', 'tag thm-room', r.title);
          a.href = 'https://tryhackme.com/room/' + encodeURIComponent(r.code);
          a.target = '_blank'; a.rel = 'noopener';
          if (r.difficulty === 'medium' || r.difficulty === 'hard') a.classList.add('thm-' + r.difficulty);
          row.append(a);
        });
        root.append(row);
      });

      if (d.updated) root.append(el('div', 'thm-meta thm-updated', 'Synced from TryHackMe · ' + d.updated));
    })
    .catch(() => { root.textContent = 'Could not load TryHackMe data right now.'; });
})();
