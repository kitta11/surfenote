/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				// Ensure colors are defined inside the colors object
				primaryColor: '#003366',
				secondaryColor: '#708090',
				primaryBg: '#F5F5F5',
				secondaryBg: '#FFFFFF',
				alertColor: '#DC143C',
				darkGreen: '#2E8B57',
				mediumGreen: '#3CB371',
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
