/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  safelist: [
    'bg-light-blue',
    'bg-light-gray-bg',
    'text-dark-blue',
    'text-gray-text',
    'text-dark-gray-text',
    'outline-border-gray',
    'font-source-sans'
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#E8F4FD',
        'dark-blue': '#2A6EBB',
        'gray-text': '#6A6A6A',
        'dark-gray-text': '#4A4A4A',
        'light-gray-bg': '#F8F8F8',
        'border-gray': '#F2F2F2',
        'text-main-title': '#2A2A2A',
        'text-main-description': '#8A8A8A',
        'border-accordion-gray': '#D2D2D2',
      },
      fontFamily: {
        'source-sans': ['Source Sans Pro', 'Inter', 'system-ui', 'sans-serif'],
      },      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
}