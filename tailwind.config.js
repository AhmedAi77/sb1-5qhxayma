/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#070412',
          lighter: '#0F0A1A',
          darker: '#050309'
        },
        gold: {
          DEFAULT: 'rgba(202, 138, 4, 0.9)',
          light: 'rgba(234, 179, 8, 0.9)'
        }
      },
      screens: {
        'xs': '375px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        'screen-dvh': '100dvh',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(202, 138, 4, 0.3)',
        'glow-lg': '0 0 30px rgba(202, 138, 4, 0.4)',
      }
    },
  },
  plugins: [],
};