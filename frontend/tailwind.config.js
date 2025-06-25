/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'walmart-blue': '#0071ce',
        'walmart-blue-dark': '#004c87',
        'walmart-yellow': '#ffc220',
        'walmart-yellow-dark': '#e6a81a',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
