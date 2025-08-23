/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#7C444F",
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
