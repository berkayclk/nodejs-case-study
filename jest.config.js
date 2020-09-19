module.exports = {
    testEnvironment: 'node',
    transform: {
        '.js': 'jest-esm-transformer',
    },
    testMatch: ['**/__tests__/**/*.spec.[jt]s?(x)'],
};
