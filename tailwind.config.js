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
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',  // ティール（メインカラー）
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        secondary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',  // ローズ（アクセントカラー）
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // アンバー（ゴールドオプション用）
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        background: '#ffffff',  // 背景色
      },
      fontFamily: {
        sans: [
          'Noto Sans JP',
          'Hiragino Kaku Gothic ProN',
          'Hiragino Sans',
          'Meiryo',
          'sans-serif',
        ],
        serif: [
          'Noto Serif JP',
          'Hiragino Mincho ProN',
          'Yu Mincho',
          'serif',
        ],
      },
      boxShadow: {
        ios: '0 8px 30px rgba(0, 0, 0, 0.12)',
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        profile: '0 4px 12px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'ping-slow': 'ping 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'floating': 'floating 0.8s ease-in-out infinite',
        'rotate': 'rotate 4s linear infinite',
        'rotating': 'rotating 0.8s linear infinite',
        'shine': 'shine 2s ease-in-out infinite',
        'shining': 'shining 0.8s ease-in-out infinite',
        'exploding': 'exploding 0.8s ease-out forwards',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'twinkling': 'twinkling 0.8s ease-in-out infinite',
        'rising': 'rising 0.8s ease-out forwards',
        'flying': 'flying 1.2s ease-in-out forwards',
        'burning': 'burning 0.8s ease-in-out infinite',
        'rainbow': 'rainbow 6s linear infinite',
        'pulsing': 'pulsing 0.8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floating: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rotating: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shine: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
        shining: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1', filter: 'brightness(1.5)' },
        },
        exploding: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.7' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        twinkling: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1', filter: 'brightness(1.3)' },
        },
        rising: {
          '0%': { transform: 'translateY(50px)', opacity: '0.4' },
          '100%': { transform: 'translateY(-50px)', opacity: '0' },
        },
        flying: {
          '0%': { transform: 'translateX(-100px) translateY(50px)', opacity: '0' },
          '50%': { transform: 'translateX(0) translateY(0)', opacity: '1' },
          '100%': { transform: 'translateX(100px) translateY(-50px)', opacity: '0' },
        },
        burning: {
          '0%': { filter: 'brightness(1) hue-rotate(0deg)' },
          '50%': { filter: 'brightness(1.5) hue-rotate(45deg)' },
          '100%': { filter: 'brightness(1) hue-rotate(90deg)' },
        },
        rainbow: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        pulsing: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        },
      },
      borderRadius: {
        'large': '1rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
