/* engine/assets/js/site.js — progressive enhancement only.
   Reading, navigation and every page work with JavaScript disabled.
   No analytics, no pixel, no third-party loader, no cookies. */
(function () {
  'use strict';

  var hdr = document.querySelector('[data-hdr]');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    document.addEventListener('scroll', onScroll, { passive: true });

    var burger = document.querySelector('[data-hdr-burger]');
    var panel = document.querySelector('[data-hdr-panel]');
    if (burger && panel) {
      burger.addEventListener('click', function () {
        var open = panel.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  }
})();
