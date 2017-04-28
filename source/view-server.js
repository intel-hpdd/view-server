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

import * as fp from '@mfl/fp';
import http from 'http';
import https from 'https';
import loginRoute from './routes/login-route';
import indexRoute from './routes/index-route';
import viewRouter from './view-router';
import conf from './conf';
import cspPolicy from './lib/csp-policy';

import { waitForRequests } from './lib/api-request';

import type { IncomingMessage } from 'http';

// Don't limit pool to 5 in node 0.10.x
// $FlowFixMe: node libdefs don't have Agent stuff.
https.globalAgent.maxSockets = http.globalAgent.maxSockets = Infinity;

loginRoute();
indexRoute();

export default () => {
  const server = http
    .createServer((req: IncomingMessage, res: Object) => {
      viewRouter.go(
        req.url,
        {
          verb: req.method,
          clientReq: req
        },
        {
          clientRes: res,
          redirect(path: string) {
            res.setHeader('Content-Security-Policy', cspPolicy);
            res.writeHead(302, { Location: path });
            res.end();
          }
        }
      );
    })
    .listen(conf.VIEW_SERVER_PORT);

  return function stop(done: Function = fp.noop) {
    server.on('close', (err: ?Error) => {
      if (err) throw err;

      waitForRequests(done);
    });
  };
};
