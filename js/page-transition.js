/* ============================================================
   IBEN STUDIO — OVERLAPPING PAGE TRANSITION ENGINE
   ============================================================ */

(function () {
  'use strict';

  // Create the transition overlay element on load
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  overlay.innerHTML = '<div class="transition-brand">IBEN</div>';
  document.body.appendChild(overlay);

  // Intercept all internal navigation link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');

    // Skip anchor-only links, external links, mailto, tel, and javascript
    if (!href) return;
    if (href.startsWith('#')) return;
    if (href.startsWith('mailto:')) return;
    if (href.startsWith('tel:')) return;
    if (href.startsWith('javascript:')) return;
    if (link.target === '_blank') return;
    if (link.hostname && link.hostname !== window.location.hostname) return;

    // It's an internal page navigation — trigger overlapping transition
    e.preventDefault();
    navigateWithTransition(href);
  });

  function navigateWithTransition(url) {
    // Activate the overlay
    overlay.classList.add('active');

    // Wait for the overlay to fully cover the screen, then navigate
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  }

  // On page load, if the overlay is active (from a previous navigation), reveal the new page
  window.addEventListener('load', () => {
    // Small delay to ensure paint, then slide the overlay away
    requestAnimationFrame(() => {
      overlay.classList.add('reveal');
      setTimeout(() => {
        overlay.classList.remove('active', 'reveal');
      }, 600);
    });
  });
})();
