/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefdf6',
          100: '#d6f9e9',
          200: '#b0f2d6',
          300: '#7ce6bd',
          400: '#3ed297',
          500: '#19b87b',
          600: '#0c9a64',
          700: '#0a7a52',
          800: '#0b6043',
          900: '#0a4e38',
          950: '#042b1f',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        ink: {
          50: '#f8f9fb',
          100: '#eef0f4',
          200: '#dde1e8',
          300: '#c2c8d4',
          400: '#9ba3b3',
          500: '#717a8c',
          600: '#565d6e',
          700: '#424850',
          800: '#2e3138',
          900: '#1c1e23',
          950: '#111216',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(17,18,22,0.04), 0 1px 3px rgba(17,18,22,0.06)',
        card: '0 2px 8px rgba(17,18,22,0.06), 0 1px 2px rgba(17,18,22,0.04)',
        float: '0 8px 24px rgba(17,18,22,0.08), 0 2px 6px rgba(17,18,22,0.04)',
        glow: '0 0 0 1px rgba(25,184,123,0.2), 0 8px 32px rgba(25,184,123,0.12)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(25,184,123,0.4)' },
          '70%': { boxShadow: '0 0 0 8px rgba(25,184,123,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(25,184,123,0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        shimmer: 'shimmer 1.5s infinite',
        'pulse-ring': 'pulse-ring 2s infinite',
      },
    },
  },
  plugins: [],
};
