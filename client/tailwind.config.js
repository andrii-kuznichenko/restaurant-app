/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', 'node_modules/flowbite-react/lib/esm/**/*.js',  /* src folder, for example */],
  
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin'),],
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
        'light-lime': '#f7fee7',
        'dark-lime1': '#3f6212',
        'dark-lime2': '#365314',
        'dark-lime3': '#1a2e05',
        'orange400':'#fb923c',
        'orange500':'#f97316',
        'yellow300':'#fde047'
        
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require("daisyui"),
  ],
}
