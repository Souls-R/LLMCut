/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,css}"],
  theme: {
    extend: {
      colors: {
        'background': '#fffdea',
        'blockRed': '#FF6F6F',
        'blockRedDark': '#FF4040',
        'blockBlue':'#6DCBFF',
        'blcokBlueDark':'#005584',
        'blockYellow':'#FFDF6F',
        'blockYellowDark':'#967500',
      },
      spacing: {
        'blockSmall': '165px',
        'blockLarge': '320px',
        'blockWide': '414px',
        'buttonSmall': '77px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}

