// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';
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
