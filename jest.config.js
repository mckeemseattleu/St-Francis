const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to to load next.config.js and .env in test environment
    dir: './',
});

const customJestConfig = {
    moduleNameMapper: {
        // Handle module aliases (this will be automatically configured for you soon)
        '^@/components/(.*)$': '<rootDir>/components/$1',
        '^@/app/(.*)$': '<rootDir>/app/$1',
        '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
        '^@/providers/(.*)$': '<rootDir>/providers/$1',
        '^@/styles/(.*)$': '<rootDir>/styles/$1',
        '^@/utils/(.*)$': '<rootDir>/utils/$1',
        '^@/models/(.*)$': '<rootDir>/models/$1',
        '^@/firebase/(.*)$': '<rootDir>/firebase/$1',
    },
    testEnvironment: 'jest-environment-jsdom',
    preset: "ts-jest",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
