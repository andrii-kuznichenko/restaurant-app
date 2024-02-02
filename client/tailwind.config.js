/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src folder, for example
    "./index.html",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "dark-sapphire-blue": "#0F3057",
        "teal-blue": "#00587A",
        "cyan-azure": "#008891",
        "off-white": "#E7E7DE",
        "light-lime": "#f7fee7",
        "dark-lime1": "#3f6212",
        "dark-lime2": "#365314",
        "dark-lime3": "#1a2e05",
        orange400: "#fb923c",
        orange500: "#f97316",
        yellow300: "#fde047",
      },
      height: {
        content: "max-content",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("daisyui")],
};
