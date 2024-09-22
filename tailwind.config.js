/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        googlesans: ['Google-Sans'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}