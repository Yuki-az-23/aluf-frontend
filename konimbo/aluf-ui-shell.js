// Aluf UI Shell — javascript_before
// Block Konimbo's bundle_v2 CSS and JS from loading.
// Konimbo content is hidden unconditionally by css_before — no class needed here.
(function() {
  var BLOCKED = 'd3m9l0v76dty0.cloudfront.net';

  new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType !== 1) return;
        var src = node.src || node.href || '';
        if (src.indexOf(BLOCKED) !== -1) {
          node.remove();
        }
        if (node.querySelectorAll) {
          node.querySelectorAll('link[href*="' + BLOCKED + '"], script[src*="' + BLOCKED + '"]')
            .forEach(function(el) { el.remove(); });
        }
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  // Also handle already-present elements
  document.querySelectorAll('link[href*="' + BLOCKED + '"], script[src*="' + BLOCKED + '"]')
    .forEach(function(el) { el.remove(); });
})();
