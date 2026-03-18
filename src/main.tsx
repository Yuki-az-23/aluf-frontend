import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './theme/tokens.css';

const root = document.getElementById('aluf-root');
if (root) {
  // Move #aluf-root to be a direct child of <body> so CSS hiding works
  // (Konimbo injects it inside #wrapper, which our CSS would hide)
  if (root.parentElement !== document.body) {
    document.body.appendChild(root);
  }

  try {
    document.body.classList.add('aluf-loaded');
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (err) {
    console.error('[aluf] React render failed:', err);
    document.body.classList.remove('aluf-loaded');
    root.innerHTML =
      '<div style="text-align:center;padding:40px;font-family:Heebo,sans-serif;">' +
      '<p style="font-size:18px;margin-bottom:16px;">\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D8\u05E2\u05D9\u05E0\u05EA \u05D4\u05D0\u05EA\u05E8</p>' +
      '<p style="font-size:14px;color:#666;">' + (err instanceof Error ? err.message : String(err)) + '</p>' +
      '<a href="javascript:location.reload()" style="color:#FF6B00;font-weight:bold;">\u05DC\u05D7\u05E5 \u05DB\u05D0\u05DF \u05DC\u05E8\u05E2\u05E0\u05D5\u05DF</a></div>';
  }
} else {
  console.error('[aluf] #aluf-root element not found');
}
