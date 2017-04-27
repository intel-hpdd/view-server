// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import url from 'url';
import path from 'path';
import helpText from '@mfl/help';
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
  // $FlowIgnore: bad libdef
  API_URL: url.format(parsedServerHttpUrl),
  HOST_NAME: parsedServerHttpUrl.hostname,
  PARSED_API_URL: parsedServerHttpUrl,
  TEMPLATE_ROOT_NEW: modulesPath('@mfl', 'gui', 'dist') + path.sep,
  TEMPLATE_ROOT_OLD: modulesPath('@mfl', 'old-gui', 'templates') + path.sep,
  HELP_TEXT: helpText
});

export default conf;
