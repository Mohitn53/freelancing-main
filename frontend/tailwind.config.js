/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#111111',
        secondary: '#ffffff',
        accent: '#f5f5f5',
        neon: '#dfff00',
      }
    },
  },
  plugins: [],
}
