/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}' /* src folder, for example */],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
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
    require('flowbite/plugin'),
  ],
}
