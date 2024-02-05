/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // src folder, for example
    "./index.html",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'dark-sapphire-blue': '#0F3057',
        'teal-blue': '#00587A',
        'cyan-azure': '#008891',
        
        
        /*very lights shades of gray-zinc*/
        'light-slate-50': '#f8fafc',
        'light-slate-100': '#f1f5f9',
        'light-gray-50': '#f9fafb',
        'light-gray-100': '#f3f4f6',
        'light-zinc-50': '#fafafa',
        'light-zinc-100': '#f4f4f5',
        'light-neutral-50': '#fafafa',
        'light-neutral-100': '#f5f5f5',
        'light-stone-50': '#fafaf9',
        'light-stone-100': '#f5f5f4',

        
        'orange400':'#fb923c',
        'orange500':'#f97316',
        'yellow300':'#fde047',

        'teal800': '#115e59',
        'teal900': '#134e4a',
        'cyan800': '#155e75',
        'cyan900': '#164e63',
       'indigo1':'#818cf8', 
        


      },

      screens: {
        xxs: "320px",
        xs: "425px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        xxxl: "2560px",
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require("daisyui"),
  ],
};
