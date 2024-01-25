/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-sapphire-blue': '#0F3057',
        'teal-blue': '#00587A',
        'cyan-azure': '#008891',
        'off-white': '#E7E7DE'
      }
    },
  },
  plugins: [],
}
