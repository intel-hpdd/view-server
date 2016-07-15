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

'use strict';

var url = require('url');
var path = require('path');
var helpText = require('intel-help');
var obj = require('intel-obj');
var confJson = require('./conf.json');

var defaults = {
  LOG_PATH: '',
  LOG_FILE: 'view_server.log',
  NODE_ENV: process.env.NODE_ENV || 'development',
  RUNNER: process.env.RUNNER
};

var conf = obj.merge({}, defaults, confJson);

var managerPath = path.join.bind(path.join, conf.SITE_ROOT);

// Set the appropriate values when in the test environment
if (conf.NODE_ENV === 'test')
  conf = obj.merge({}, conf, {
    SERVER_HTTP_URL: 'https://localhost:8000/',
    IS_RELEASE: false,
    ALLOW_ANONYMOUS_READ: true,
    STATIC_URL: '/static/',
    VERSION: '',
    BUILD: 'jenkins__',
    VIEW_SERVER_PORT: 8889,
    LOG_PATH: conf.SITE_ROOT
  });

var parsedServerHttpUrl = url.parse(conf.SERVER_HTTP_URL);
conf = obj.merge({}, conf, {
  API_PORT: parsedServerHttpUrl.port,
  API_URL: url.format(parsedServerHttpUrl),
  HOST_NAME: parsedServerHttpUrl.hostname,
  PARSED_API_URL: parsedServerHttpUrl,
  TEMPLATE_ROOT: managerPath('chroma_ui', 'templates') + path.sep,
  HELP_TEXT: helpText
});

module.exports = conf;
