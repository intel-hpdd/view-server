// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import conf from './conf.js';
import start from './view-server.js';

if (conf.RUNNER === 'supervisor') {
  process.on('SIGINT', cleanShutdown('SIGINT (Ctrl-C)'));
  process.on('SIGTERM', cleanShutdown('SIGTERM'));
}

function cleanShutdown(signal) {
  return () => {
    console.log(`Caught ${signal}, shutting down cleanly.`); // eslint-disable-line no-console
    // Exit with 0 to keep supervisor happy.
    process.exit(0);
  };
}

start();
