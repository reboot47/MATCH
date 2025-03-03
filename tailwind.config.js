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
          50: '#edf9f6',
          100: '#dbf4ed',
          200: '#b7e9db',
          300: '#93dfc9',
          400: '#6fd4b7',
          500: '#66cdaa',  // ミディアムアクアマリン（メインカラー）
          600: '#58b491',
          700: '#4a9b78',
          800: '#3c8260',
          900: '#2e6947',
        },
        secondary: {
          50: '#f0fdf0',
          100: '#dcfbdc',
          200: '#bbf7bb',
          300: '#9af39a',
          400: '#90ee90',  // ライトグリーン（アクセントカラー）
          500: '#65d365',
          600: '#48b348',
          700: '#3d913d',
          800: '#357435',
          900: '#2d5e2d',
        },
        gray: {
          50: '#f9f9f9',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#9a9a9a',
          600: '#808080',  // グレー（テキスト/アイコンカラー）
          700: '#696969',
          800: '#525252',
          900: '#3d3d3d',
        },
        background: '#ffffff',  // 背景色
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
};
