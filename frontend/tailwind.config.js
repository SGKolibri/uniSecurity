/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'custom11': '1100px',
      'custom14': '1400px',
    },
    extend: {
      colors: {
        'regal-blue': '#243c5a',
        'dark-blue': '#0a1236',
        'black': '#000',
        'navbar': '00151F'
      },
      colorScheme: {
        "dark-blue": "#0a1236",
        "btnBlack": "#000000",
      },
      backgroundImage: {
        'gradient-bg': 'linear-gradient(90deg, #0A5364 0%, #094756 17.01%, #0B1B1A 67.51%, #0E110A 90.06%)',
      }
    }
  },
  plugins: [
  ]
}



/*
'btnBlue': '#162778',
'darkBlue': '#0a1236',
*/