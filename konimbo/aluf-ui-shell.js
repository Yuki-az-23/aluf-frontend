// Aluf UI Shell — javascript_before
// NOTE: body.aluf-loaded is added by React in main.tsx AFTER successful mount.
// This file is intentionally minimal — only used for {{var_to_json}} config injection.
// Do NOT add aluf-loaded class here — that would hide Konimbo UI before React loads,
// breaking graceful degradation if the CDN is unreachable.

// Block Konimbo's bundle_v2 CSS and JS from loading
(function() {
  var BLOCKED = 'd3m9l0v76dty0.cloudfront.net';

  // MutationObserver to catch dynamically added links/scripts
  new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType !== 1) return;
        var src = node.src || node.href || '';
        if (src.indexOf(BLOCKED) !== -1) {
          node.remove();
        }
        // Also check children (e.g., <link> inside <head>)
        if (node.querySelectorAll) {
          node.querySelectorAll('link[href*="' + BLOCKED + '"], script[src*="' + BLOCKED + '"]')
            .forEach(function(el) { el.remove(); });
        }
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  // Also remove any already-present tags
  document.querySelectorAll('link[href*="' + BLOCKED + '"], script[src*="' + BLOCKED + '"]')
    .forEach(function(el) { el.remove(); });
})();
