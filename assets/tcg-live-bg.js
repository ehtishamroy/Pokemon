/*
 * TCG Hitz — live energy background.
 *
 * Canvas FX layer for the fixed `.tcg-live-bg` element rendered in layout/theme.liquid
 * (the drifting gradient field itself is pure CSS, see tailwind-input.css):
 *   - embers: orange/red glowing specks rising on the fire side (right),
 *   - sparks: blue/cyan specks flickering on the lightning side (left),
 *   - lightning: an occasional jagged bolt on the left third with a faint flash.
 *
 * Purely decorative: aria-hidden, pointer-events none, no listeners on page UI.
 * Pauses while the tab is hidden, stays off under prefers-reduced-motion and
 * Save-Data, caps DPR at 1.5 and frame rate at ~45fps.
 */
(function () {
  'use strict';

  var root = document.querySelector('.tcg-live-bg');
  if (!root) return;
  var canvas = root.querySelector('.tcg-live-bg__fx');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  if (saveData) return;

  var DENSITY = { subtle: 0.55, normal: 1, intense: 1.6 };
  var density = DENSITY[root.getAttribute('data-intensity')] || 1;
  var lightningOn = root.getAttribute('data-lightning') !== 'false';
  var FRAME_MS = 1000 / 45;

  var W = 0, H = 0, dpr = 1;
  var embers = [], sparks = [], bolts = [];
  var raf = 0, last = 0, acc = 0, nextBolt = 0, flash = 0;
  root.__tcgFrames = 0;

  /* ---- pre-rendered glow sprites (no per-particle shadowBlur) ------------ */
  function sprite(stops) {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var g = c.getContext('2d');
    var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    for (var i = 0; i < stops.length; i++) grad.addColorStop(stops[i][0], stops[i][1]);
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return c;
  }
  var EMBER = [
    sprite([[0, 'rgba(255,240,210,1)'], [0.12, 'rgba(255,170,60,.95)'], [0.35, 'rgba(255,90,20,.45)'], [1, 'rgba(232,41,44,0)']]),
    sprite([[0, 'rgba(255,220,180,1)'], [0.12, 'rgba(255,110,30,.9)'], [0.4, 'rgba(232,41,44,.35)'], [1, 'rgba(160,20,40,0)']]),
  ];
  var SPARK = [
    sprite([[0, 'rgba(235,250,255,1)'], [0.12, 'rgba(120,210,255,.95)'], [0.4, 'rgba(62,140,255,.4)'], [1, 'rgba(20,70,217,0)']]),
    sprite([[0, 'rgba(240,230,255,1)'], [0.12, 'rgba(170,120,255,.9)'], [0.4, 'rgba(139,61,255,.35)'], [1, 'rgba(90,30,200,0)']]),
  ];

  function rand(a, b) { return a + Math.random() * (b - a); }

  /* ---- particles -------------------------------------------------------- */
  function newEmber(initial) {
    // Fire lives on the right: bias spawn x towards the right edge.
    var x = Math.random() < 0.75 ? W * (0.55 + Math.pow(Math.random(), 0.7) * 0.5) : W * Math.random();
    return {
      x: x,
      y: initial ? rand(0, H) : H + rand(4, 40),
      vy: -rand(18, 58),          // px per second
      vx: -rand(0, 10),
      sway: rand(6, 22),
      phase: rand(0, 6.28),
      freq: rand(0.6, 1.6),
      r: rand(2.2, 6.5),
      life: 0,
      ttl: rand(5, 11),
      s: EMBER[Math.random() < 0.65 ? 0 : 1],
    };
  }
  function newSpark(initial) {
    // Lightning side on the left: spawn in the left ~40%.
    return {
      x: W * Math.pow(Math.random(), 1.4) * 0.45,
      y: initial ? rand(0, H) : rand(H * 0.1, H),
      vx: rand(-8, 16),
      vy: rand(-22, 6),
      r: rand(1.6, 4.6),
      life: 0,
      ttl: rand(2.5, 6),
      flick: rand(8, 18),
      s: SPARK[Math.random() < 0.8 ? 0 : 1],
    };
  }

  /* ---- lightning (midpoint displacement + one branch) ------------------- */
  function bolt(x1, y1, x2, y2, disp, out) {
    if (disp < 3) { out.push([x2, y2]); return; }
    var mx = (x1 + x2) / 2 + (Math.random() - 0.5) * disp;
    var my = (y1 + y2) / 2 + (Math.random() - 0.5) * disp * 0.35;
    bolt(x1, y1, mx, my, disp / 2, out);
    bolt(mx, my, x2, y2, disp / 2, out);
  }
  function spawnBolt() {
    var x1 = W * rand(0.04, 0.3), y1 = -10;
    var x2 = x1 + W * rand(-0.08, 0.12), y2 = H * rand(0.45, 0.8);
    var main = [[x1, y1]];
    bolt(x1, y1, x2, y2, Math.min(W, H) * 0.22, main);
    var paths = [main];
    var from = main[Math.floor(main.length * rand(0.3, 0.6))];
    if (from) {
      var br = [[from[0], from[1]]];
      bolt(from[0], from[1], from[0] + W * rand(0.03, 0.12), from[1] + H * rand(0.12, 0.25), Math.min(W, H) * 0.08, br);
      paths.push(br);
    }
    bolts.push({ paths: paths, life: 0, ttl: 0.42, x: x1 });
    flash = 1;
  }
  function scheduleBolt(now) {
    var base = density >= 1.5 ? 5000 : density < 1 ? 9000 : 6500;
    nextBolt = now + base + Math.random() * 4000;
  }

  /* ---- sizing ----------------------------------------------------------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var area = Math.max(0.45, Math.min(1.5, (W * H) / (1440 * 900)));
    var nE = Math.round(30 * density * area);
    var nS = Math.round(20 * density * area);
    while (embers.length < nE) embers.push(newEmber(true));
    while (sparks.length < nS) sparks.push(newSpark(true));
    embers.length = nE;
    sparks.length = nS;
  }
  var resizeT = 0;
  function onResize() {
    clearTimeout(resizeT);
    resizeT = setTimeout(resize, 150);
  }

  /* ---- frame ------------------------------------------------------------ */
  function draw(dt, now) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    var i, p, a, t;
    for (i = 0; i < embers.length; i++) {
      p = embers[i];
      p.life += dt;
      if (p.life > p.ttl || p.y < -20) { embers[i] = newEmber(false); continue; }
      p.y += p.vy * dt;
      p.x += (p.vx + Math.sin(p.life * p.freq + p.phase) * p.sway) * dt;
      t = p.life / p.ttl;
      a = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
      ctx.globalAlpha = Math.max(0, a) * 0.85;
      var er = p.r * 4 * (1 - t * 0.5);
      ctx.drawImage(p.s, p.x - er / 2, p.y - er / 2, er, er);
    }

    for (i = 0; i < sparks.length; i++) {
      p = sparks[i];
      p.life += dt;
      if (p.life > p.ttl) { sparks[i] = newSpark(false); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      t = p.life / p.ttl;
      a = (t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8) * (0.55 + 0.45 * Math.sin(p.life * p.flick));
      ctx.globalAlpha = Math.max(0, a) * 0.9;
      var sr = p.r * 4;
      ctx.drawImage(p.s, p.x - sr / 2, p.y - sr / 2, sr, sr);
    }

    if (lightningOn) {
      if (!nextBolt) nextBolt = now + rand(1800, 3500); // first strike soon after load
      if (now >= nextBolt) { spawnBolt(); scheduleBolt(now); }

      if (flash > 0) {
        // Faint sky flash on the lightning side; decays in ~0.3s (well under 3 flashes/s).
        var fx = bolts.length ? bolts[bolts.length - 1].x : W * 0.15;
        var g = ctx.createRadialGradient(fx, H * 0.2, 0, fx, H * 0.2, Math.max(W, H) * 0.55);
        g.addColorStop(0, 'rgba(120,190,255,' + (0.16 * flash).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(20,70,217,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        flash = Math.max(0, flash - dt * 3.2);
      }

      for (i = bolts.length - 1; i >= 0; i--) {
        var b = bolts[i];
        b.life += dt;
        if (b.life > b.ttl) { bolts.splice(i, 1); continue; }
        t = b.life / b.ttl;
        // flicker: bright, dip, bright, fade
        a = t < 0.2 ? 1 : t < 0.32 ? 0.35 : t < 0.5 ? 0.95 : 1 - (t - 0.5) / 0.5;
        for (var k = 0; k < b.paths.length; k++) {
          var path = b.paths[k];
          ctx.beginPath();
          ctx.moveTo(path[0][0], path[0][1]);
          for (var j = 1; j < path.length; j++) ctx.lineTo(path[j][0], path[j][1]);
          ctx.lineJoin = 'round';
          ctx.globalAlpha = a * (k ? 0.55 : 0.8);
          ctx.strokeStyle = 'rgba(62,160,255,.9)';
          ctx.lineWidth = k ? 3 : 6;
          ctx.shadowColor = 'rgba(62,193,255,1)';
          ctx.shadowBlur = 18;
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = a * (k ? 0.7 : 1);
          ctx.strokeStyle = '#EAF7FF';
          ctx.lineWidth = k ? 0.8 : 1.6;
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (!last) last = now;
    var elapsed = now - last;
    acc += elapsed;
    last = now;
    if (acc < FRAME_MS) return;
    var dt = Math.min(acc, 100) / 1000; // clamp after long frames
    acc = 0;
    draw(dt, now);
    root.__tcgFrames++;
  }

  function start() {
    if (raf || document.hidden || (reduceMotion && reduceMotion.matches)) return;
    last = 0;
    acc = 0;
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  function onMotionChange() {
    if (reduceMotion.matches) {
      stop();
      ctx.clearRect(0, 0, W, H);
    } else {
      start();
    }
  }

  resize();
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
  if (reduceMotion) {
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onMotionChange);
    else if (reduceMotion.addListener) reduceMotion.addListener(onMotionChange);
  }
  start();
})();
