#!/usr/bin/env node

'use strict';

var Jasmine = require('jasmine');
var jasmine = new Jasmine();
require('intel-jasmine-n-matchers');

if (process.env.RUNNER === 'CI') {
  var jasmineJUnitReporter = require('intel-jasmine-junit-reporter');

  var junitReporter = jasmineJUnitReporter({
    specTimer: new jasmine.jasmine.Timer(),
    JUnitReportSavePath: process.env.SAVE_PATH || './',
    JUnitReportFilePrefix: process.env.FILE_PREFIX || 'view-server-results-' +  process.version,
    JUnitReportSuiteName: 'View Server Reports',
    JUnitReportPackageName: 'View Server Reports'
  });

  jasmine.jasmine.getEnv().addReporter(junitReporter);
}

jasmine.loadConfig({
  spec_dir: 'dist/test',
  spec_files: [
    '**/*.js'
  ],
  random: true
});

jasmine.execute();
