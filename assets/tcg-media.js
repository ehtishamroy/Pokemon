/* TCG Hitz — "Photos & videos" viewer (sections/tcg-vm-media.liquid).
   Clicking a tile opens a <dialog> with the full photo or the video (loaded only now, from the tile's <template>).
   Previous / next buttons, ← → keys and swipes move through the items; closing empties the viewer so videos stop. */
(function () {
  'use strict';

  function init(root) {
    if (!root || root.__hzMedia) return;
    var dialog = root.querySelector('[data-media-dialog]');
    var items = Array.prototype.slice.call(root.querySelectorAll('.hz-media__item'));
    if (!dialog || !items.length || typeof dialog.showModal !== 'function') return;
    root.__hzMedia = true;

    var stage = dialog.querySelector('[data-media-stage]');
    var captionOut = dialog.querySelector('[data-media-caption-out]');
    var count = dialog.querySelector('[data-media-count]');
    var navs = dialog.querySelectorAll('[data-media-step]');
    var current = 0;
    var opener = null;

    function show(i) {
      current = (i + items.length) % items.length;
      var item = items[current];
      var full = item.querySelector('template[data-media-full]');
      var cap = item.querySelector('template[data-media-caption]');
      stage.innerHTML = '';
      if (full) stage.appendChild(full.content.cloneNode(true));
      var text = cap ? cap.innerHTML.trim() : '';
      captionOut.innerHTML = text;
      captionOut.hidden = !text;
      count.textContent = (current + 1) + ' / ' + items.length;
      Array.prototype.forEach.call(navs, function (b) { b.hidden = items.length < 2; });
      var video = stage.querySelector('video');
      if (video) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
    }

    function close() {
      if (dialog.open) dialog.close();
    }

    root.addEventListener('click', function (e) {
      var tile = e.target.closest('[data-media-open]');
      if (!tile || !root.contains(tile)) return;
      opener = tile;
      show(parseInt(tile.getAttribute('data-media-open'), 10) || 0);
      dialog.showModal();
      document.documentElement.classList.add('hz-noscroll');
    });

    dialog.addEventListener('click', function (e) {
      var step = e.target.closest('[data-media-step]');
      if (step) { show(current + parseInt(step.getAttribute('data-media-step'), 10)); return; }
      if (e.target.closest('[data-media-close]') || e.target === dialog) close();
    });
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    });
    var startX = null;
    stage.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    stage.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) > 50 && e.pointerType !== 'mouse') show(current + (dx < 0 ? 1 : -1));
    });
    dialog.addEventListener('close', function () {
      stage.innerHTML = '';
      document.documentElement.classList.remove('hz-noscroll');
      if (opener) opener.focus();
    });
  }

  var boot = function () { document.querySelectorAll('[data-hz-media]').forEach(init); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('shopify:section:load', function (e) {
    var root = e.target && e.target.querySelector('[data-hz-media]');
    if (root) init(root);
  });
})();
