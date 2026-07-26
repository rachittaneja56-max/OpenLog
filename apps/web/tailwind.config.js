/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        muted: 'var(--muted)',
        yellow: 'var(--yellow)',
        pink: 'var(--pink)',
        blue: 'var(--blue)',
        green: 'var(--green)',
        orange: 'var(--orange)',
        purple: 'var(--purple)',
        danger: 'var(--danger)',
        border: 'var(--border)',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        neo: '6px 6px 0 var(--border)',
        'neo-sm': '4px 4px 0 var(--border)',
      },
    },
  },
  plugins: [],
};
