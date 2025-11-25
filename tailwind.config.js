/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(25px, -35px) scale(1.05)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '75%': { transform: 'translate(35px, 35px) scale(1.05)' },
        },
      },
      animation: {
        blob: 'blob 8s ease-in-out infinite',
      },
      boxShadow: {
        glass: '0 25px 50px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
}

