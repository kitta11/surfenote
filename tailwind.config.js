/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryColor: '#2596be',
        secondaryColor: '#fcd444',
        primaryBg: '#F5F5F5',
        secondaryBg: '#FFFFFF',
        alertColor: '#e53935',
        green: '#bcd89c',
        orange: '#e8a11f',
      },
      fontSize: {
        tiny: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '16px',
        4: '24px',
        5: '32px',
      },
      borderRadius: {
        small: '4px',
        medium: '8px',
      },
    },
  },
  plugins: [],
}
