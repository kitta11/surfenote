export default {
	roots: ['<rootDir>'],
	preset: 'ts-jest',
	testEnvironment: 'jest-environment-jsdom',
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	cache: false,
}
