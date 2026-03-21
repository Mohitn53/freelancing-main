/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Barlow', 'Inter', 'sans-serif'],
        heading: ['Barlow Condensed', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: '#0a0a0a',
        secondary: '#ffffff',
        accent: '#f5f5f5',
        sport: '#00C896',       // Teal/mint – main brand accent
        'sport-dark': '#009b74',
        fire: '#E8271A',        // Red – energy/sale
        gold: '#F5A623',        // Gold – premium/highlight
        neon: '#C6FF00',        // Neon lime – performance
        navy: '#0D1B2A',        // Dark navy – backgrounds
        'sport-light': '#E8FBF5', // Tinted sport bg
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,200,150,0.3)' },
          '50%': { boxShadow: '0 0 20px 6px rgba(0,200,150,0.15)' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
