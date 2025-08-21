/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#c47e7e",
        merahtua: "#F53838",
      },
    },
    fontFamily: {
      rubik: ["Rubik", "sans-serif"],
      ovo: ["Ovo", "serif"],
      poppins: ["Poppins", "sans-serif"],
    },
  },
  plugins: [],
};
