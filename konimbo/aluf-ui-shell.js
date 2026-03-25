// Aluf UI Shell — javascript_before
// Block Konimbo's bundle_v2 CSS and JS from loading (NOT images!).
// Konimbo content is hidden unconditionally by css_before — no class needed here.
(function() {
  var BLOCKED = 'd3m9l0v76dty0.cloudfront.net';

  // Only block <link> (CSS) and <script> (JS) tags from CloudFront.
  // Do NOT block <img> tags — product images are served from the same CDN.
  function shouldBlock(node) {
    var tag = node.nodeName;
    if (tag !== 'LINK' && tag !== 'SCRIPT') return false;
    var src = node.src || node.href || '';
    return src.indexOf(BLOCKED) !== -1;
  }

  new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType !== 1) return;
        if (shouldBlock(node)) {
          node.remove();
          return;
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

  // Handle ticket submissions from the React app via postMessage
  window.addEventListener('message', function(e) {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type !== 'FAQ_LEAD_SUBMISSION') return;

    var d = e.data.payload;
    var p = new URLSearchParams();
    p.append('ticket[customer_name]', d.name);
    p.append('ticket[customer_phone]', d.phone);
    p.append('ticket[customer_email]', d.email);
    p.append('ticket[item_id]', d.item_id || '8765261');
    p.append('ticket[content]', d.message);
    p.append('ticket[newsletter]', '0');

    fetch('/tickets', { method: 'POST', body: p })
      .then(function(res) {
        if (res.ok && e.source) {
          e.source.postMessage({ type: 'SUBMISSION_SUCCESS' }, e.origin || '*');
        }
      })
      .catch(function(err) { console.error('[Aluf] Ticket submission error:', err); });
  }, false);
})();
