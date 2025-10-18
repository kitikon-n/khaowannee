export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #DDFFFF 0%, #DDEEFF 50%, #DDDDFF 100%)'
      },
      colors: {
        'bg-peach': '#FDD2C9',
        'bg-light-peach': '#FEECE7',
        'bg-yellow': '#FDF9C7',
        'bg-light-yellow': '#FFFCE6',
        'bg-purple': '#E0C9FD',
        'bg-light-purple': '#EFE2FF',
      }
    }
  },
  plugins: [],
}