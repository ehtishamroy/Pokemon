/* TCG Hitz — vending machine locations map (sections/tcg-locations.liquid).
   Reads the location cards ([data-loc] with data-lat / data-lng) and draws a Leaflet map with one pin each.
   Clicking "Show on map" (or a pin) highlights the card and opens the pin's popup. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function (s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  function init(root) {
    if (!root || root.__hzLoc) return;
    var mapEl = root.querySelector('[data-loc-map]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-loc]'));
    if (!mapEl || !cards.length) return;

    var points = cards.filter(function (c) {
      var lat = parseFloat(c.dataset.lat), lng = parseFloat(c.dataset.lng);
      return isFinite(lat) && isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
    });

    var noMap = function () {
      root.classList.add('hz-loc--nomap');
      var msg = root.querySelector('[data-loc-nomap]');
      if (msg) msg.hidden = false;
    };
    if (!window.L || !points.length) { noMap(); return; }
    root.__hzLoc = true;

    var d = mapEl.dataset;
    var map = window.L.map(mapEl, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
    window.L.tileLayer(d.tiles, { attribution: d.attribution, maxZoom: 19, subdomains: 'abcd' }).addTo(map);

    var icon = function (status) {
      return window.L.divIcon({
        className: 'hz-pin' + (status === 'soon' ? ' hz-pin--soon' : ''),
        html: '<span class="hz-pin__pulse"></span><span class="hz-pin__dot"></span>',
        iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -16]
      });
    };

    var popupHtml = function (c) {
      var soon = c.dataset.status === 'soon';
      var dir = c.querySelector('[data-loc-directions]');
      return '<div class="hz-pop">' +
        '<span class="hz-loc__badge ' + (soon ? 'hz-loc__badge--soon' : 'hz-loc__badge--live') + '">' + esc(soon ? d.soonLabel : d.liveLabel) + '</span>' +
        '<strong class="hz-pop__name">' + esc(c.dataset.name) + '</strong>' +
        (c.dataset.address ? '<span class="hz-pop__addr">' + esc(c.dataset.address) + '</span>' : '') +
        (c.dataset.hours ? '<span class="hz-pop__hours">' + esc(c.dataset.hours) + '</span>' : '') +
        (dir ? '<a class="hz-pop__link" href="' + esc(dir.getAttribute('href')) + '" target="_blank" rel="noopener">' + esc(d.directionsLabel) + ' →</a>' : '') +
        '</div>';
    };

    var markers = [];
    var setActive = function (card) {
      cards.forEach(function (c) { c.classList.toggle('is-active', c === card); });
    };

    points.forEach(function (c) {
      var ll = [parseFloat(c.dataset.lat), parseFloat(c.dataset.lng)];
      var m = window.L.marker(ll, { icon: icon(c.dataset.status), title: c.dataset.name, keyboard: true, riseOnHover: true }).addTo(map);
      m.bindPopup(popupHtml(c), { className: 'hz-popup', maxWidth: 260 });
      m.on('click', function () { setActive(c); });
      c.__hzMarker = m;
      markers.push(m);
    });

    if (markers.length === 1) {
      map.setView(markers[0].getLatLng(), 14);
    } else {
      map.fitBounds(window.L.featureGroup(markers).getBounds().pad(0.25), { maxZoom: 14 });
    }

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-loc-focus]');
      if (!btn || !root.contains(btn)) return;
      var card = btn.closest('[data-loc]');
      var m = card && card.__hzMarker;
      if (!m) return;
      setActive(card);
      var ll = m.getLatLng();
      if (reduce) map.setView(ll, 15); else map.flyTo(ll, 15, { duration: 0.8 });
      window.setTimeout(function () { m.openPopup(); }, reduce ? 0 : 820);
      var r = mapEl.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) mapEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });

    /* Leaflet needs a size refresh when the map was hidden or resized (theme editor, fade-in). */
    window.setTimeout(function () { map.invalidateSize(); }, 400);
    window.addEventListener('resize', function () { map.invalidateSize(); });
  }

  var boot = function () { document.querySelectorAll('[data-hz-locations]').forEach(init); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('shopify:section:load', function (e) {
    var root = e.target && e.target.querySelector('[data-hz-locations]');
    if (root) init(root);
  });
})();
