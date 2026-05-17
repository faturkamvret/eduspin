import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        rarity: {
          common: '#9ca3af',
          rare: '#3b82f6',
          epic: '#a855f7',
          legendary: '#f59e0b',
        },
      },
      fontFamily: {
        display: ['"Comic Sans MS"', 'Quicksand', 'system-ui', 'sans-serif'],
        body: ['Quicksand', 'system-ui', 'sans-serif'],
      },
      animation: {
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 1.2s ease-in-out infinite',
        'pop-in': 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
