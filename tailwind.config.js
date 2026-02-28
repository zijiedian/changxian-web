/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#07c160',
          dark: '#0a9c52',
          soft: '#e8faf0',
        },
        ink: '#183024',
        muted: '#577368',
        paper: '#eef8f3',
      },
      boxShadow: {
        soft: '0 18px 40px rgba(29, 110, 77, 0.14)',
        poster: '0 18px 40px rgba(15, 23, 42, 0.18)',
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Satoshi', 'Manrope', 'Avenir Next', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        display: ['Oswald', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
