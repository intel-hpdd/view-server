// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import url from 'url';
import path from 'path';
import helpText from '@iml/help';
// $FlowFixMe this file does not exist at dev-time.
import confJson from './conf.json';

type confT = {
  LOG_PATH: string,
  LOG_FILE: string,
  NODE_ENV: string,
  RUNNER: string,
  SERVER_HTTP_URL: string,
  IS_RELEASE: boolean,
  ALLOW_ANONYMOUS_READ: boolean,
  SITE_ROOT: string,
  VERSION: string,
  BUILD: string,
  VIEW_SERVER_PORT: number,
  API_PORT: string,
  API_URL: string,
  HOST_NAME: string,
  PARSED_API_URL: Object,
  TEMPLATE_ROOT_NEW: string,
  TEMPLATE_ROOT_OLD: string,
  HELP_TEXT: Object
};

let conf: confT = Object.assign(
  {
    LOG_PATH: '',
    LOG_FILE: 'view_server.log',
    NODE_ENV: process.env.NODE_ENV || 'development',
    RUNNER: process.env.RUNNER
  },
  confJson
);

const modulesPath = path.join.bind(
  path.join,
  conf.SITE_ROOT,
  'ui-modules',
  'node_modules'
);

if (conf.NODE_ENV === 'test')
  conf = Object.assign({}, conf, {
    SERVER_HTTP_URL: 'https://localhost:8000/',
    IS_RELEASE: false,
    ALLOW_ANONYMOUS_READ: true,
    VERSION: '',
    BUILD: 'jenkins__',
    VIEW_SERVER_PORT: 8889,
    LOG_PATH: conf.SITE_ROOT
  });

const parsedServerHttpUrl = url.parse(conf.SERVER_HTTP_URL);
conf = Object.assign({}, conf, {
  API_PORT: parsedServerHttpUrl.port,
  API_URL: url.format(parsedServerHttpUrl),
  HOST_NAME: parsedServerHttpUrl.hostname,
  PARSED_API_URL: parsedServerHttpUrl,
  TEMPLATE_ROOT_NEW: modulesPath('@iml', 'gui', 'dist') + path.sep,
  TEMPLATE_ROOT_OLD: modulesPath('@iml', 'old-gui', 'templates') + path.sep,
  HELP_TEXT: helpText
});

export default conf;
