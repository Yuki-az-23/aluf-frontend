import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './theme/tokens.css';

const root = document.getElementById('aluf-root');
if (root) {
  document.body.classList.add('aluf-loaded');
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error('[aluf] #aluf-root element not found');
}
