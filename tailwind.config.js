/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chakra: {
          bg: '#f8fafc', // Slate 50
          panel: '#ffffff', // White
          border: '#e2e8f0', // Slate 200
          accent: '#2563eb', // Corporate Blue
          warning: '#d97706', // Amber 600
          danger: '#dc2626', // Red 600
          success: '#16a34a', // Green 600
          gold: '#b45309' // Amber 700
        }
      }
    },
  },
  plugins: [],
}
