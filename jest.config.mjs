export default {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|expo|@expo|react-redux|immer))',
  ],
  testMatch: ['<rootDir>/tests/ui/**/*.test.tsx'],
};
