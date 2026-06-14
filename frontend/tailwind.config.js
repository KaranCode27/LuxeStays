/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hotel: {
          dark: '#0B0e14',
          card: '#161925',
          gold: '#C5A880',
          accent: '#E6D5B8',
          textHover: '#FFFFFF',
          textMuted: '#9CA3AF'
        }
      }
    },
  },
  plugins: [],
}
