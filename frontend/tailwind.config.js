/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF5F0',
          100: '#FFE8DB',
          200: '#FFD0B5',
          300: '#FFB088',
          400: '#FF8C5A',
          500: '#FF6B35',
          600: '#E85D2A',
          700: '#C44D20',
        },
        surface: {
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
        },
      },
    },
  },
  plugins: [],
}
