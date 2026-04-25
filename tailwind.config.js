/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        'card-hover': 'var(--color-card-hover)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        border: 'var(--color-border)',
        'input-bg': 'var(--color-input-bg)',
      },
    },
  },
  plugins: [],
};
