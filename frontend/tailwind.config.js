/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amazon: {
          dark: '#0F172A', // Map to secondary
          lightDark: '#1E293B',
          yellow: '#F97316', // Map to accent
          yellowHover: '#EA580C',
          grayBg: '#F8FAFC',
          blueAccent: '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        slideRight: 'slideInRight 0.3s ease-out',
        slideLeft: 'slideInLeft 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
