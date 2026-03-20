import type { Config } from 'tailwindcss';

export default {
  important: '#aluf-root',
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--aluf-primary)',
        secondary: 'var(--aluf-secondary)',
        'brand-purple': 'var(--aluf-brand-purple)',
        'header-bg': 'var(--aluf-header-bg)',
        'header-text': 'var(--aluf-header-text)',
        'header-text-muted': 'var(--aluf-header-text-muted)',
        'header-border': 'var(--aluf-header-border)',
        'page-bg': 'var(--aluf-page-bg)',
        'card-bg': 'var(--aluf-card-bg)',
        'text-main': 'var(--aluf-text-main)',
        'text-muted': 'var(--aluf-text-muted)',
        'border-light': 'var(--aluf-border-light)',
        'border-accent': 'var(--aluf-border-accent)',
        'input-bg': 'var(--aluf-input-bg)',
      },
      fontFamily: {
        sans: ['Heebo', 'sans-serif'],
        display: ['Assistant', 'sans-serif'],
      },
      boxShadow: {
        tech: 'var(--aluf-shadow-tech)',
        'tech-hover': 'var(--aluf-shadow-tech-hover)',
      },
      maxWidth: {
        container: '1800px',
      },
    },
  },
  plugins: [],
} satisfies Config;
