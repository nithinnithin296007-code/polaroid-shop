/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        candy: {
          pink:   '#FF6B9D',
          yellow: '#FFE135',
          blue:   '#4ECDC4',
          purple: '#A855F7',
          orange: '#FF8C42',
          green:  '#06D6A0',
        },
        ink: '#1A1A2E',
      },
      animation: {
        'float':    'float 3s ease-in-out infinite',
        'wiggle':   'wiggle 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in':  'fadeIn 0.6s ease-out',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        wiggle:  { '0%,100%': { transform: 'rotate(-3deg)' }, '50%': { transform: 'rotate(3deg)' } },
        slideUp: { from: { transform: 'translateY(30px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
     marquee: {
  '0%':   { transform: 'translateX(0)' },
  '100%': { transform: 'translateX(-50%)' },
},
},
    },
  },
  plugins: [],
}