'use strict';

require('jasmine-n-matchers');

if (process.env.RUNNER === 'CI') {
  var krustyJasmineReporter = require('krusty-jasmine-reporter');

  var junitReporter = new krustyJasmineReporter.KrustyJasmineJUnitReporter({
    specTimer: new jasmine.Timer(),
    JUnitReportSavePath: process.env.SAVE_PATH || './',
    JUnitReportFilePrefix: process.env.FILE_PREFIX || 'view-server-results-' +  process.version,
    JUnitReportSuiteName: 'View Server Reports',
    JUnitReportPackageName: 'View Server Reports'
  });

  jasmine.getEnv().addReporter(junitReporter);
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
