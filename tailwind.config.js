/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0c', // very dark background
        panel: '#16110f', // dark brown panel background
        panelBorder: '#2e2520', // subtle brown border
        textGold: '#e8d3b8',
        textMuted: '#8b7d6b',
        quas: '#3b82f6',
        wex: '#a855f7',
        exort: '#ef4444',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
