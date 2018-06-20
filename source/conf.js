// @flow

//
// Copyright (c) 2018 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import helpText from '@iml/help';
import path from 'path';
import url from 'url';

type confT = {
  ALLOW_ANONYMOUS_READ: boolean,
  API_PORT: string,
  API_URL: string,
  BUILD: string,
  HELP_TEXT: Object,
  HOST_NAME: string,
  IS_RELEASE: boolean,
  LOG_FILE: string,
  LOG_PATH: string,
  NODE_ENV: string,
  PARSED_API_URL: Object,
  SERVER_HTTP_URL: string,
  SITE_ROOT: string,
  TEMPLATE_ROOT_NEW: string,
  TEMPLATE_ROOT_OLD: string,
  VERSION: string,
  VIEW_SERVER_PORT: number
};

const env: confT = (process.env: any);

let conf: $Shape<confT> = {
  ALLOW_ANONYMOUS_READ: env.ALLOW_ANONYMOUS_READ,
  BUILD: env.BUILD,
  IS_RELEASE: env.IS_RELEASE,
  LOG_FILE: 'view_server.log',
  LOG_PATH: env.LOG_PATH || '',
  NODE_ENV: env.NODE_ENV || 'development',
  SERVER_HTTP_URL: env.SERVER_HTTP_URL,
  SITE_ROOT: env.SITE_ROOT,
  VERSION: env.VERSION,
  VIEW_SERVER_PORT: env.VIEW_SERVER_PORT
};

if (conf.NODE_ENV === 'test')
  conf = Object.assign({}, conf, {
    ALLOW_ANONYMOUS_READ: true,
    BUILD: 'jenkins__',
    LOG_PATH: conf.SITE_ROOT,
    SERVER_HTTP_URL: 'https://localhost:8000/',
    IS_RELEASE: false,
    VERSION: '',
    VIEW_SERVER_PORT: 8889
  });

const parsedServerHttpUrl = url.parse(conf.SERVER_HTTP_URL);
conf = Object.assign({}, conf, {
  API_PORT: parsedServerHttpUrl.port,
  API_URL: url.format(parsedServerHttpUrl),
  HOST_NAME: parsedServerHttpUrl.hostname,
  PARSED_API_URL: parsedServerHttpUrl,
  TEMPLATE_ROOT_NEW:
    path.sep + path.join('usr', 'lib', 'iml-manager', 'iml-gui') + path.sep,
  TEMPLATE_ROOT_OLD:
    path.sep +
    path.join('usr', 'lib', 'node_modules', '@iml', 'old-gui', 'templates') +
    path.sep,
  HELP_TEXT: helpText
});

export default conf;
