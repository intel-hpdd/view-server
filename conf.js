//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
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

var nconf = require('nconf');
var url = require('url');
var path = require('path');
var fs = require('fs');

// Indicate that the memory store will be used so values can be set after nconf is defined.
nconf.use('memory');
var conf = nconf
  .env()
  .argv()
  .file(__dirname + '/conf.json')
  .defaults({
    LOG_PATH: '',
    LOG_FILE: 'view_server.log'
  });

var managerPath = path.join.bind(path.join, conf.get('SITE_ROOT'));

// Set the appropriate values when in the test environment
if (conf.get('NODE_ENV') === 'test') {
  conf.set('SERVER_HTTP_URL', 'https://localhost:8000/');
  conf.set('IS_RELEASE', false);
  conf.set('ALLOW_ANONYMOUS_READ', true);
  conf.set('STATIC_URL', '/static/');
  conf.set('VERSION', '');
  conf.set('BUILD', 'jenkins__');
  conf.set('VIEW_SERVER_PORT', 8889);
  conf.set('LOG_PATH', conf.get('SITE_ROOT'));

  var helpText = fs.readFileSync(managerPath('chroma_help', 'help.py'), { encoding: 'utf8' })
      .match(/({[\s\S]*})/mg)[0]
     .replace(/"""/mg, '\'')
     .replace(/: "(.+)"/mg, ': \'($1)\'')
     .replace(/\\'/mg, '\'')
     .replace(/"/mg, '\\"')
     .replace(/'(.+)':/gm, '"$1":')
     .replace(/: '(.+)',/gm, ': "$1",')
     .replace(/: '\n([\s\S]+)',/mg, ': "$1"')
     .replace(/\n/mg, '');

  helpText = JSON.parse(helpText);

  conf.set('HELP_TEXT', helpText);
}

var parsedServerHttpUrl = url.parse(conf.get('SERVER_HTTP_URL'));
conf.overrides({
  API_PORT: parsedServerHttpUrl.port,
  API_URL: url.format(parsedServerHttpUrl),
  HOST_NAME: parsedServerHttpUrl.hostname,
  PARSED_API_URL: parsedServerHttpUrl,
  TEMPLATE_ROOT: managerPath('chroma_ui', 'templates') + path.sep
});

module.exports = conf;
