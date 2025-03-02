/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f3',
          100: '#ccefe7',
          200: '#99dfcf',
          300: '#66cfb7',
          400: '#33bf9f',
          500: '#66cdaa',  // ミディアムアクアマリン
          600: '#5bb799',
          700: '#4aaea9',
          800: '#39a195',
          900: '#288480',
        },
      },
      fontFamily: {
        sans: [
          'Hiragino Kaku Gothic ProN',
          'Hiragino Sans',
          'Meiryo',
          'sans-serif',
        ],
      },
      boxShadow: {
        ios: '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
