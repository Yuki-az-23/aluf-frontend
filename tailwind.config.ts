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
        'page-bg': 'var(--aluf-page-bg)',
        'card-bg': 'var(--aluf-card-bg)',
        'text-main': 'var(--aluf-text-main)',
        'text-muted': 'var(--aluf-text-muted)',
        'border-light': 'var(--aluf-border-light)',
        'border-accent': 'var(--aluf-border-accent)',
      },
      fontFamily: {
        sans: ['Heebo', 'sans-serif'],
        display: ['Assistant', 'sans-serif'],
      },
      boxShadow: {
        tech: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        'tech-hover': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      },
      maxWidth: {
        container: '1800px',
      },
    },
  },
  plugins: [],
} satisfies Config;
