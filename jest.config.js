module.exports = {
  resetModules: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/test'],
  transformIgnorePatterns: ['/node_modules/(?!@mfl)/'],
  setupTestFrameworkScriptFile: './test/jest-matchers.js'
};
