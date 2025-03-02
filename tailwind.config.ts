import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // LINEBUZZのカラースキーム
        primary: {
          50: "#e6f7f2",
          100: "#ccefe5",
          200: "#99dfcb",
          300: "#66cdaa", // メインカラー: ミディアムアクアマリン
          400: "#4dc3a0",
          500: "#33b996",
          600: "#29a487",
          700: "#1f8f78",
          800: "#147a69",
          900: "#0a655a",
          950: "#00504b",
        },
        secondary: {
          50: "#f0fbf0",
          100: "#e0f7e0",
          200: "#c2f0c2",
          300: "#90ee90", // セカンダリーカラー: ライトグリーン
          400: "#70e770",
          500: "#50e050",
          600: "#30c730",
          700: "#20b020",
          800: "#108910",
          900: "#006200",
          950: "#004d00",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#808080", // グレー
          600: "#636363",
          700: "#4b5563",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        error: {
          50: "#fff1f3",
          100: "#ffe4e8",
          200: "#fecdd6",
          300: "#ffb6c1", // エラーカラー: ライトピンク
          400: "#fd8ba0",
          500: "#f96180",
          600: "#e53f65",
          700: "#c22a51",
          800: "#a42244",
          900: "#8c1d3d",
        },
      },
      fontFamily: {
        sans: [
          '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"',
          '"Noto Sans JP"',
          'Meiryo',
          'sans-serif',
          'system-ui',
        ],
        serif: [
          '"Hiragino Mincho ProN"',
          '"Noto Serif JP"',
          'serif',
        ],
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'slide-out-left': 'slide-out-left 0.5s ease-in',
        'fade-in': 'fade-in 0.3s ease-in',
        'fade-out': 'fade-out 0.3s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-left': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
