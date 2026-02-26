/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#07c160',
          dark: '#0a9c52',
          soft: '#e6f7ef',
        },
        ink: '#1d2129',
        muted: '#5c667a',
        paper: '#f5f6f8',
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)',
        poster: '0 18px 40px rgba(15, 23, 42, 0.18)',
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
        display: ['Oswald', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
