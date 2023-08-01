module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {}],
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
};
