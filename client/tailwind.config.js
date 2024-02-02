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

        'light-slate-50': '#f8fafc',
        'light-gray-50': '#f9fafb',
        'light-zinc-50': '#fafafa',
        'light-neutral-50': '#fafafa',
        'light-stone-50': '#fafaf9',
        
        'orange400':'#fb923c',
        'orange500':'#f97316',
        'yellow300':'#fde047',

        'teal800': '#115e59',
        'teal900': '#134e4a',
        'cyan800': '#155e75',
        'cyan900': '#164e63',

        'light-gray': '#E7E7DE',

        
        buttonBackground: '#115e59',
        buttonText: 'black',
        footerBackground: '#115e59',
        footerText: '#613677',
        containerBackground: '#E7E7DE',
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}
