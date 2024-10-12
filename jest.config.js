module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
    setupFilesAfterEnv: ['<rootDir>/test/singleton.ts'],
  };
  