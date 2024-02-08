/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src folder, for example
    "./index.html",
    "node_modules/flowbite-react/lib/esm/**/*.js",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {

      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      }, 
      
      colors: {
        "dark-sapphire-blue": "#0F3057",
        "teal-blue": "#00587A",
        "cyan-azure": "#008891",
        "off-white": "#E7E7DE",
        

        "light-gray": "#E7E7DE",
        "dark-lime1": "#3f6212",
        footerBackground: "#008891",

        'colour1':'#008891',
      },

      screens: {
        xxs: "320px",
        xs: "375px",
        s: "425px",
        sm: "640px",
        md: "768px",//tablet
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        xxxl: "2560px",
      },

      fontSize: {
        'xs': '0.85rem',   // Extra small
        'sm': '0.9rem',  // Small
        'base': '1rem',
        'l': '1.1rem',   // Base (default)
        'lg': '1.15rem', // Large
        'xl': '1.25rem',  // Extra large
      }

    },
  },
  plugins: [require("flowbite/plugin"), require("daisyui")],
};
