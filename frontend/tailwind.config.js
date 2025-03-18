/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        prozalibre: ['Proza Libre'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}