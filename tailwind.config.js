

/** @type {import('tailwindcss').Config} */
import tailwindcssMotion from 'tailwindcss-motion';

export default {
  content: ['./src/react-app/**/*.{html,js,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a0e1a',
          primary: '#0d9c6e',
          accent: '#f59e0b',
          elevated: '#161b2b',
          secondary: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'scroll': 'scroll 40s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [tailwindcssMotion],
};

