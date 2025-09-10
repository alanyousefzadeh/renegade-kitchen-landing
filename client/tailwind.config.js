/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F3E9D8',
        ink: '#1B1B1B',
        charcoal: '#2B2B2B',
        gold: '#C9A227',
        honey: '#E0B44C'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
