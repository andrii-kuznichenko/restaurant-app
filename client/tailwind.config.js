const withMT = require("@material-tailwind/react/utils/withMT");
/** @type {import('tailwindcss').Config} */

module.exports = withMT({
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
});

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
        'off-white': '#E7E7DE',

      }
    },
  },
  plugins: [
  ],
}
