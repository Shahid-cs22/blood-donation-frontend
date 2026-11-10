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
        brand: {
          red: '#BB2B29',
          dark: '#530404',
          light: '#FFE8E8',
          soft: '#ECA0A0',
          white: '#FFFFFF',
          darkBg: '#120a0a',
          darkCard: '#1f1313',
          darkBorder: '#3d1c1c'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Lufga', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Lufga', 'sans-serif']
      },
      boxShadow: {
        'brand-glow': '0 10px 30px -5px rgba(187, 43, 41, 0.25)',
        'card-soft': '0 4px 20px -2px rgba(83, 4, 4, 0.05)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem'
      }
    },
  },
  plugins: [],
}

