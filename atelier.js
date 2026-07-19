/* RarityX Atelier — shared page-transition veil + scroll reveals.
   Included by medallion.html, sigil.html, and the five ring pages. */
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── VEIL: seamless page-to-page transition ──
  var veil = document.createElement('div');
  veil.className = 'rx-veil';
  veil.setAttribute('aria-hidden', 'true');
  document.body.appendChild(veil);

  // entering: veil starts covering, slides away
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { veil.classList.add('rx-veil--open'); });
  });

  // leaving: internal links marked data-rx-nav sweep the veil back in first
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-rx-nav]');
    if (!a || prefersReduced) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || a.target === '_blank') return;
    e.preventDefault();
    veil.classList.remove('rx-veil--open');
    setTimeout(function () { window.location.href = href; }, 520);
  });

  // restore veil state when page is served from bfcache (back button)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) veil.classList.add('rx-veil--open');
  });

  // ── REVEALS ──
  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
    });
  }, { threshold: 0.22 });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 6) * 0.07 + 's';
    ro.observe(el);
  });

  window.RX = { prefersReduced: prefersReduced, veil: veil };
})();
