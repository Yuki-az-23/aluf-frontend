// Aluf UI Shell — javascript_before
// NOTE: body.aluf-loaded is added by React in main.tsx AFTER successful mount.
// This file is intentionally minimal — only used for {{var_to_json}} config injection.
// Do NOT add aluf-loaded class here — that would hide Konimbo UI before React loads,
// breaking graceful degradation if the CDN is unreachable.

// Block Konimbo's bundle_v2 CSS and JS from loading
// AND hide Konimbo content ASAP to prevent flash of unstyled content
(function() {
  var BLOCKED = 'd3m9l0v76dty0.cloudfront.net';

  new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType !== 1) return;

        // Hide Konimbo content as soon as <body> appears
        if (node.nodeName === 'BODY') {
          node.classList.add('aluf-loading');
        }

        // Block CloudFront bundles
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
  if (document.body) document.body.classList.add('aluf-loading');
  document.querySelectorAll('link[href*="' + BLOCKED + '"], script[src*="' + BLOCKED + '"]')
    .forEach(function(el) { el.remove(); });
})();
