/*
 * TCG Hitz — "Collector's Universe" live background.
 *
 * Canvas FX layer for the fixed `.tcg-live-bg` element rendered in layout/theme.liquid
 * (the nebula and the neon floor grid are pure CSS, see tailwind-input.css):
 *   - particles: tiny blue / cyan / pink specks (a few gold) drifting and twinkling,
 *   - cards: faint holographic card outlines with the crown card back, drifting and
 *     turning very slowly, with an occasional shimmer,
 *   - gold sweep: a soft band of gold light with sparkles crossing the screen now and then,
 *   - lightning: a rare, thin blue / pink / yellow bolt near the screen edges.
 *
 * Deliberately quiet so products and prices read first. Purely decorative:
 * aria-hidden, pointer-events none, no listeners on page UI. Pauses while the tab is
 * hidden, stays off under prefers-reduced-motion and Save-Data, caps DPR at 1.5 and
 * frame rate at ~45fps.
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
  if (navigator.connection && navigator.connection.saveData) return;

  var DENSITY = { subtle: 0.6, normal: 1, intense: 1.5 };
  var density = DENSITY[root.getAttribute('data-intensity')] || 0.6;
  var lightningOn = root.getAttribute('data-lightning') !== 'false';
  var FRAME_MS = 1000 / 45;

  var W = 0, H = 0, dpr = 1;
  var particles = [], cards = [], bolts = [], sparkles = [];
  var sweep = null;
  var raf = 0, last = 0, acc = 0, clock = 0, nextBolt = 0, nextSweep = 0, flash = 0, flashRGB = '77,168,255';
  root.__tcgFrames = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ---- pre-rendered sprites (no per-frame shadowBlur) --------------------- */
  function glowSprite(rgb) {
    var c = document.createElement('canvas');
    c.width = c.height = 32;
    var g = c.getContext('2d');
    var grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.18, 'rgba(' + rgb + ',.95)');
    grad.addColorStop(0.5, 'rgba(' + rgb + ',.25)');
    grad.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    return c;
  }
  var DOTS = {
    blue: glowSprite('77,168,255'),
    cyan: glowSprite('62,193,255'),
    pink: glowSprite('255,79,216'),
    gold: glowSprite('255,214,90'),
  };

  // Card outline with a crown on the back; drawn once, rotated/positioned per frame.
  var CARD_W = 70, CARD_H = 98;
  function cardSprite() {
    var pad = 14;
    var c = document.createElement('canvas');
    c.width = CARD_W + pad * 2;
    c.height = CARD_H + pad * 2;
    var g = c.getContext('2d');
    g.translate(pad, pad);
    var stroke = g.createLinearGradient(0, 0, CARD_W, CARD_H);
    stroke.addColorStop(0, 'rgba(77,168,255,1)');
    stroke.addColorStop(0.55, 'rgba(139,61,255,1)');
    stroke.addColorStop(1, 'rgba(255,79,216,1)');
    g.shadowColor = 'rgba(100,150,255,.9)';
    g.shadowBlur = 8;
    g.strokeStyle = stroke;
    g.lineWidth = 1.4;
    roundRect(g, 0, 0, CARD_W, CARD_H, 7);
    g.stroke();
    g.lineWidth = 0.8;
    roundRect(g, 5, 5, CARD_W - 10, CARD_H - 10, 4);
    g.stroke();
    // crown
    g.shadowColor = 'rgba(255,210,90,.9)';
    g.strokeStyle = 'rgba(255,214,90,1)';
    g.lineWidth = 1.3;
    g.lineJoin = 'round';
    var cx = CARD_W / 2, cy = CARD_H / 2;
    g.beginPath();
    g.moveTo(cx - 14, cy + 7);
    g.lineTo(cx - 16, cy - 7);
    g.lineTo(cx - 7, cy);
    g.lineTo(cx, cy - 11);
    g.lineTo(cx + 7, cy);
    g.lineTo(cx + 16, cy - 7);
    g.lineTo(cx + 14, cy + 7);
    g.closePath();
    g.stroke();
    return c;
  }
  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  var CARD = cardSprite();

  /* ---- particles ------------------------------------------------------- */
  function newParticle(initial) {
    var roll = Math.random();
    var s = roll < 0.42 ? DOTS.blue : roll < 0.7 ? DOTS.cyan : roll < 0.92 ? DOTS.pink : DOTS.gold;
    return {
      x: rand(0, W),
      y: initial ? rand(0, H) : H + rand(4, 30),
      vx: rand(-4, 4),
      vy: -rand(3, 12),
      size: rand(2.2, 6.5),
      tw: rand(0.6, 2.2),
      ph: rand(0, 6.28),
      a: rand(0.25, 0.7),
      s: s,
    };
  }

  /* ---- holographic card outlines --------------------------------------- */
  function newCard(initial) {
    // Prefer the outer thirds so the reading column stays clean.
    var side = Math.random() < 0.5 ? rand(0.02, 0.3) : rand(0.7, 0.98);
    var depth = rand(0.55, 1.25);
    return {
      x: W * side,
      y: initial ? rand(0, H) : H + 120,
      vy: -rand(4, 10) * depth,
      vx: rand(-3, 3),
      rot: rand(-0.6, 0.6),
      vr: rand(-0.06, 0.06),
      scale: depth,
      a: rand(0.05, 0.11),
      shimmerAt: clock + rand(4, 16),
      shimmer: 0,
    };
  }

  /* ---- gold sweep ------------------------------------------------------ */
  function startSweep() {
    sweep = { t: 0, dur: 2.8 };
    var n = Math.round(14 * density) + 6;
    for (var i = 0; i < n; i++) {
      sparkles.push({ k: Math.random(), off: rand(-0.12, 0.12), size: rand(5, 13), life: 0, ttl: rand(1, 2) });
    }
  }
  function scheduleSweep() { nextSweep = clock + rand(15, 25); }

  /* ---- lightning (midpoint displacement + one branch) ------------------ */
  var BOLT_RGB = ['77,168,255', '255,79,216', '255,226,74'];
  function bolt(x1, y1, x2, y2, disp, out) {
    if (disp < 3) { out.push([x2, y2]); return; }
    var mx = (x1 + x2) / 2 + (Math.random() - 0.5) * disp;
    var my = (y1 + y2) / 2 + (Math.random() - 0.5) * disp * 0.35;
    bolt(x1, y1, mx, my, disp / 2, out);
    bolt(mx, my, x2, y2, disp / 2, out);
  }
  function spawnBolt() {
    var left = Math.random() < 0.5;
    var x1 = left ? W * rand(0.03, 0.22) : W * rand(0.78, 0.97), y1 = -10;
    var x2 = x1 + W * rand(-0.06, 0.06), y2 = H * rand(0.3, 0.6);
    var main = [[x1, y1]];
    bolt(x1, y1, x2, y2, Math.min(W, H) * 0.16, main);
    var paths = [main];
    var from = main[Math.floor(main.length * rand(0.35, 0.6))];
    if (from) {
      var br = [[from[0], from[1]]];
      bolt(from[0], from[1], from[0] + W * rand(-0.06, 0.06), from[1] + H * rand(0.08, 0.16), Math.min(W, H) * 0.06, br);
      paths.push(br);
    }
    var rgb = pick(BOLT_RGB);
    bolts.push({ paths: paths, life: 0, ttl: 0.38, rgb: rgb, x: x1 });
    flash = 1;
    flashRGB = rgb;
  }
  function scheduleBolt() { nextBolt = clock + rand(10, 20) / Math.max(density, 0.6); }

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
    var nP = Math.round(70 * density * area);
    var nC = Math.max(2, Math.round((W < 768 ? 2 : 5) * density));
    while (particles.length < nP) particles.push(newParticle(true));
    while (cards.length < nC) cards.push(newCard(true));
    particles.length = nP;
    cards.length = nC;
  }
  var resizeT = 0;
  function onResize() {
    clearTimeout(resizeT);
    resizeT = setTimeout(resize, 150);
  }

  /* ---- frame ------------------------------------------------------------ */
  function draw(dt) {
    clock += dt;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    var i, p, a;

    // particles
    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y < -12 || p.x < -12 || p.x > W + 12) { particles[i] = newParticle(false); continue; }
      a = p.a * (0.55 + 0.45 * Math.sin(clock * p.tw + p.ph));
      ctx.globalAlpha = Math.max(0, a);
      ctx.drawImage(p.s, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }

    // card outlines
    for (i = 0; i < cards.length; i++) {
      p = cards[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      if (p.y < -160) { cards[i] = newCard(false); continue; }
      if (clock >= p.shimmerAt) { p.shimmer = 1; p.shimmerAt = clock + rand(8, 20); }
      if (p.shimmer > 0) p.shimmer = Math.max(0, p.shimmer - dt * 0.8);
      a = p.a * (1 + 2.2 * Math.sin(Math.PI * p.shimmer));
      ctx.save();
      ctx.globalAlpha = Math.min(0.4, a);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(p.scale, p.scale);
      ctx.drawImage(CARD, -CARD.width / 2, -CARD.height / 2);
      ctx.restore();
    }

    // gold sweep: a soft diagonal band of light with sparkles riding it
    if (!nextSweep) nextSweep = clock + rand(5, 9); // first one soon after load
    if (!sweep && clock >= nextSweep) { startSweep(); scheduleSweep(); }
    if (sweep) {
      sweep.t += dt;
      var k = sweep.t / sweep.dur;
      if (k >= 1) {
        sweep = null;
      } else {
        var diag = Math.hypot(W, H);
        var pos = -0.25 + k * 1.5; // band centre along the diagonal, 0..1 = on screen
        var g = ctx.createLinearGradient(0, 0, W, H);
        var lo = Math.max(0, Math.min(1, pos - 0.08));
        var mid = Math.max(0, Math.min(1, pos));
        var hi = Math.max(0, Math.min(1, pos + 0.08));
        var env = Math.sin(Math.PI * k);
        g.addColorStop(0, 'rgba(255,214,90,0)');
        if (lo > 0) g.addColorStop(lo, 'rgba(255,214,90,0)');
        g.addColorStop(mid, 'rgba(255,214,90,' + (0.055 * env).toFixed(3) + ')');
        if (hi < 1) g.addColorStop(hi, 'rgba(255,214,90,0)');
        g.addColorStop(1, 'rgba(255,214,90,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        // sparkles along the band
        var ux = W / diag, uy = H / diag;
        for (i = sparkles.length - 1; i >= 0; i--) {
          var s = sparkles[i];
          s.life += dt;
          if (s.life > s.ttl) { sparkles.splice(i, 1); continue; }
          var along = (pos + s.off) * diag;
          var across = (s.k - 0.5) * diag;
          var sx = along * ux - across * uy;
          var sy = along * uy + across * ux;
          var t2 = s.life / s.ttl;
          ctx.globalAlpha = Math.sin(Math.PI * t2) * 0.8;
          ctx.drawImage(DOTS.gold, sx - s.size / 2, sy - s.size / 2, s.size, s.size);
        }
      }
    } else if (sparkles.length) {
      sparkles.length = 0;
    }

    // lightning
    if (lightningOn) {
      if (!nextBolt) nextBolt = clock + rand(4, 8);
      if (clock >= nextBolt) { spawnBolt(); scheduleBolt(); }

      if (flash > 0) {
        var lastBolt = bolts.length ? bolts[bolts.length - 1] : null;
        var fx = lastBolt ? lastBolt.x : W * 0.15;
        var fg = ctx.createRadialGradient(fx, H * 0.15, 0, fx, H * 0.15, Math.max(W, H) * 0.5);
        fg.addColorStop(0, 'rgba(' + flashRGB + ',' + (0.07 * flash).toFixed(3) + ')');
        fg.addColorStop(1, 'rgba(' + flashRGB + ',0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = fg;
        ctx.fillRect(0, 0, W, H);
        flash = Math.max(0, flash - dt * 3.4);
      }

      for (i = bolts.length - 1; i >= 0; i--) {
        var b = bolts[i];
        b.life += dt;
        if (b.life > b.ttl) { bolts.splice(i, 1); continue; }
        var t = b.life / b.ttl;
        a = t < 0.2 ? 1 : t < 0.32 ? 0.35 : t < 0.5 ? 0.9 : 1 - (t - 0.5) / 0.5;
        for (var j = 0; j < b.paths.length; j++) {
          var path = b.paths[j];
          ctx.beginPath();
          ctx.moveTo(path[0][0], path[0][1]);
          for (var n = 1; n < path.length; n++) ctx.lineTo(path[n][0], path[n][1]);
          ctx.lineJoin = 'round';
          ctx.globalAlpha = a * (j ? 0.3 : 0.5);
          ctx.strokeStyle = 'rgba(' + b.rgb + ',.9)';
          ctx.lineWidth = j ? 1.6 : 3;
          ctx.shadowColor = 'rgba(' + b.rgb + ',1)';
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = a * (j ? 0.45 : 0.75);
          ctx.strokeStyle = 'rgba(255,255,255,.95)';
          ctx.lineWidth = j ? 0.5 : 1;
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
    acc += now - last;
    last = now;
    if (acc < FRAME_MS) return;
    var dt = Math.min(acc, 100) / 1000; // clamp after long frames
    acc = 0;
    draw(dt);
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
