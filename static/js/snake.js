// Snake – et lite retrospill i nettsidens stil.
// Ingen innerHTML og ingen inline-kode, slik at siden følger den strenge CSP-en.
(function () {
  const cv = document.getElementById('snake');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const N = 20;                         // brettet er 20 x 20 ruter
  const CELL = cv.width / N;
  const $ = id => document.getElementById(id);

  const C = {
    grid: 'rgba(0,200,160,0.07)',
    body: '#00e5b3',
    head: '#c8fff0',
    eye: '#050a0e',
    food: '#ff5064',
  };
  const SPEEDS = [170, 120, 80];        // ms per steg ved start
  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  let speedIdx = 1, snake, dir, queue, food, score, state = 'ready', timer, stepMs, best = 0;

  try { best = parseInt(localStorage.getItem('snake-best') || '0', 10) || 0; } catch (e) {}
  try { const s = parseInt(localStorage.getItem('snake-speed'), 10); if (s >= 0 && s <= 2) speedIdx = s; } catch (e) {}

  const pad = n => String(n).padStart(4, '0');
  function updateHud() { $('snake-score').textContent = pad(score); $('snake-best').textContent = pad(best); }

  function reset() {
    snake = [[9, 10], [8, 10], [7, 10]];
    dir = 'right'; queue = [];
    score = 0; stepMs = SPEEDS[speedIdx];
    placeFood(); updateHud();
  }

  function placeFood() {
    const free = [];
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++)
      if (!snake.some(s => s[0] === x && s[1] === y)) free.push([x, y]);
    food = free[Math.floor(Math.random() * free.length)];
  }

  const opposite = (a, b) => DIRS[a][0] === -DIRS[b][0] && DIRS[a][1] === -DIRS[b][1];

  function turn(d) {
    if (state === 'ready' || state === 'over') start();
    if (state !== 'play') return;
    const last = queue.length ? queue[queue.length - 1] : dir;
    if (d !== last && !opposite(d, last) && queue.length < 3) queue.push(d);
  }

  function step() {
    if (queue.length) dir = queue.shift();
    const [dx, dy] = DIRS[dir];
    const head = [snake[0][0] + dx, snake[0][1] + dy];
    const eating = head[0] === food[0] && head[1] === food[1];
    const body = eating ? snake : snake.slice(0, -1);
    if (head[0] < 0 || head[1] < 0 || head[0] >= N || head[1] >= N ||
        body.some(s => s[0] === head[0] && s[1] === head[1])) return gameOver(false);
    snake.unshift(head);
    if (eating) {
      score += 10 * (speedIdx + 1);
      if (snake.length === N * N) return gameOver(true);
      placeFood();
      stepMs = Math.max(SPEEDS[speedIdx] * 0.5, stepMs - 2);
    } else snake.pop();
    updateHud();
    draw();
    timer = setTimeout(step, stepMs);
  }

  function cell(x, y, inset) { ctx.fillRect(x * CELL + inset, y * CELL + inset, CELL - inset * 2, CELL - inset * 2); }

  function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = C.grid;
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) cell(x, y, 2);

    if (food) {                                  // «datapakke» med glød
      ctx.save();
      ctx.shadowColor = C.food; ctx.shadowBlur = 14; ctx.fillStyle = C.food;
      ctx.beginPath();
      ctx.arc(food[0] * CELL + CELL / 2, food[1] * CELL + CELL / 2, CELL * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.shadowColor = C.body; ctx.shadowBlur = 10; ctx.fillStyle = C.body;
    snake.forEach((s, i) => {
      cell(s[0], s[1], 2);
      const n = snake[i + 1];
      if (n) {                                   // koble leddene til én linje
        const x = Math.min(s[0], n[0]) * CELL + 2, y = Math.min(s[1], n[1]) * CELL + 2;
        const w = (Math.abs(s[0] - n[0]) + 1) * CELL - 4, h = (Math.abs(s[1] - n[1]) + 1) * CELL - 4;
        ctx.fillRect(x, y, w, h);
      }
    });
    ctx.restore();

    const [hx, hy] = snake[0], [dx, dy] = DIRS[dir];
    ctx.fillStyle = C.head; cell(hx, hy, 2);
    ctx.fillStyle = C.eye;
    const e = CELL / 6, cx = hx * CELL + CELL / 2, cy = hy * CELL + CELL / 2;
    const ox = dx * CELL * 0.18, oy = dy * CELL * 0.18, px = -dy * CELL * 0.2, py = dx * CELL * 0.2;
    ctx.fillRect(cx + ox + px - e / 2, cy + oy + py - e / 2, e, e);
    ctx.fillRect(cx + ox - px - e / 2, cy + oy - py - e / 2, e, e);
  }

  function showOverlay(title, lines, hint) {
    $('ov-title').textContent = title;
    const t = $('ov-text'); t.replaceChildren();
    lines.forEach((l, i) => { if (i) t.append(document.createElement('br')); t.append(document.createTextNode(l)); });
    $('ov-hint').textContent = hint;
    $('snake-overlay').hidden = false;
  }

  function setLive(on) { $('snake-status').classList.toggle('on', on); $('snake-status-text').textContent = on ? 'RUNNING' : 'IDLE'; }

  function start() {
    clearTimeout(timer);
    if (state !== 'paused') reset();
    state = 'play';
    $('snake-overlay').hidden = true; setLive(true);
    $('b-start').textContent = 'Restart';
    draw();
    timer = setTimeout(step, stepMs);
  }

  function pause() {
    if (state === 'play') {
      clearTimeout(timer); state = 'paused'; setLive(false);
      showOverlay('PAUSED', ['The snake is waiting for you.'], 'Press PAUSE or space to continue');
    } else if (state === 'paused') {
      state = 'play'; $('snake-overlay').hidden = true; setLive(true);
      timer = setTimeout(step, stepMs);
    }
  }

  function gameOver(won) {
    clearTimeout(timer); state = 'over'; setLive(false);
    const record = score > best;
    if (record) { best = score; try { localStorage.setItem('snake-best', best); } catch (e) {} }
    updateHud(); draw();
    const lines = [score + ' points · length ' + snake.length];
    if (record) lines.push('New high score!');
    showOverlay(won ? 'YOU WIN!' : 'GAME OVER', lines, 'Press START to play again');
    $('b-start').textContent = 'Start';
  }

  // tastatur
  const KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
  document.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    if (KEYS[e.key]) { e.preventDefault(); turn(KEYS[e.key]); }
    else if (e.key === ' ' || e.key === 'Enter') {
      if (e.target.closest && e.target.closest('a, button')) return;   // la lenker og knapper virke som normalt
      e.preventDefault();
      if (state === 'play' || state === 'paused') pause(); else start();
    } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') pause();
  });

  // knapper på skjermen
  document.querySelectorAll('[data-dir]').forEach(b =>
    b.addEventListener('pointerdown', e => { e.preventDefault(); turn(b.dataset.dir); }));
  $('b-start').addEventListener('click', () => { state = 'ready'; start(); });
  $('b-pause').addEventListener('click', () => { if (state === 'play' || state === 'paused') pause(); else start(); });

  // fart
  function setSpeed(i) {
    speedIdx = i;
    document.querySelectorAll('[data-speed]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.speed === i)));
    try { localStorage.setItem('snake-speed', i); } catch (e) {}
    if (state === 'play' || state === 'paused') { state = 'ready'; start(); }
  }
  document.querySelectorAll('[data-speed]').forEach(b => b.addEventListener('click', () => setSpeed(+b.dataset.speed)));

  // sveip på brettet
  let t0 = null;
  const screen = $('snake-screen');
  screen.addEventListener('touchstart', e => { t0 = [e.touches[0].clientX, e.touches[0].clientY]; }, { passive: true });
  screen.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
  screen.addEventListener('touchend', e => {
    if (!t0) return;
    const dx = e.changedTouches[0].clientX - t0[0], dy = e.changedTouches[0].clientY - t0[1];
    t0 = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) { if (state !== 'play') start(); return; }
    turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  });

  setSpeed(speedIdx); state = 'ready';
  reset(); draw();
})();
