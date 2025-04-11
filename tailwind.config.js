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
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        'portrait': {'raw': '(orientation: portrait)'},
        'landscape': {'raw': '(orientation: landscape)'},
        'touch': {'raw': '(hover: none) and (pointer: coarse)'},
        'stylus': {'raw': '(hover: none) and (pointer: fine)'},
        'mouse': {'raw': '(hover: hover) and (pointer: fine)'},
        'iphone-se': {'raw': '(device-width: 375px) and (device-height: 667px)'},
        'iphone-x': {'raw': '(device-width: 375px) and (device-height: 812px)'},
        'iphone-xr': {'raw': '(device-width: 414px) and (device-height: 896px)'},
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
      height: {
        'screen-dvh': '100dvh',
        'screen-svh': '100svh',
        'screen-lvh': '100lvh',
      },
      width: {
        'screen-dvw': '100dvw',
        'screen-svw': '100svw',
        'screen-lvw': '100lvw',
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
      },
      touchAction: {
        'manipulation': 'manipulation',
      }
    },
  },
  plugins: [],
};