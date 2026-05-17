import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f3',
          100: '#ffe0e6',
          200: '#ffc1cc',
          300: '#ff8fa3',
          400: '#ff5d7a',
          500: '#ff3d63',
          600: '#e92850',
          700: '#bf1d40',
        },
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        sun: {
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
        },
        sky2: {
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
        },
        mint: {
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
        },
        candy: {
          peach: '#ffd5b5',
          mint: '#bdf5d8',
          lavender: '#dabfff',
          sky: '#bae3ff',
          lemon: '#fff3b8',
          rose: '#ffc6d4',
        },
        rarity: {
          common: '#9ca3af',
          rare: '#3b82f6',
          epic: '#a855f7',
          legendary: '#f59e0b',
        },
      },
      fontFamily: {
        display: ['"Fredoka"', '"Comic Sans MS"', 'Quicksand', 'system-ui', 'sans-serif'],
        body: ['"Quicksand"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        kid: '0 8px 0 rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.08)',
        'kid-pink': '0 6px 0 #ff8fa3, 0 10px 24px rgba(255,93,122,0.25)',
        'kid-violet': '0 6px 0 #a78bfa, 0 10px 24px rgba(139,92,246,0.25)',
        'kid-mint': '0 6px 0 #4ade80, 0 10px 24px rgba(34,197,94,0.25)',
        'kid-sun': '0 6px 0 #facc15, 0 10px 24px rgba(234,179,8,0.25)',
      },
      animation: {
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 1.2s ease-in-out infinite',
        'pop-in': 'popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float': 'float 4s ease-in-out infinite',
        'rainbow-shift': 'rainbowShift 6s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        rainbowShift: {
          '0%, 100%': { filter: 'hue-rotate(0deg)' },
          '50%': { filter: 'hue-rotate(45deg)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.92' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
