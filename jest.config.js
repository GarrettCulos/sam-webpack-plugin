module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json'
    }
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts|json|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js'
  },
  testMatch: ['**/*.(test|spec).(ts|js)'],
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 1,
      lines: 5,
      statements: 0
    }
  }
};
