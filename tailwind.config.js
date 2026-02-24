/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'rgb(var(--color-background-0) / <alpha-value>)',
          50: 'rgb(var(--color-background-50) / <alpha-value>)',
          100: 'rgb(var(--color-background-100) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
        },
        foreground: {
          DEFAULT: 'rgb(var(--color-typography-0) / <alpha-value>)',
          muted: 'rgb(var(--color-typography-400) / <alpha-value>)',
          subtle: 'rgb(var(--color-typography-500) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--color-error-500) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--color-success-500) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
