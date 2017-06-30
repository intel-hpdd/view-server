module.exports = {
  resetModules: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/test'],
  transformIgnorePatterns: ['/node_modules/(?!@iml)/'],
  setupTestFrameworkScriptFile: './test/jest-matchers.js'
};
