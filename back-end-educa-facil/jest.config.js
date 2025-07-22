module.exports = {
  rootDir: '.',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '**/*.service.ts',
    '**/*.controller.ts',
    '**/*.usecase.ts',
    '**/*.guard.ts',
    '**/*.repository.ts',
    '**/*.pipe.ts',
    '**/*.strategy.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'modules/.*/DTOs/.*\\.ts$',
    'modules/.*/decorators/.*\\.ts$',
    'app.module.ts$',
    'main.ts$',
    '.*module\\.ts$',
  ],
  testEnvironment: 'node',
};
