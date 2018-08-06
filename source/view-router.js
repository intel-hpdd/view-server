// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getRouter from '@iml/router';

import checkForProblems from './middleware/check-for-problems.js';
import getSession from './middleware/get-session.js';
import getCache from './middleware/get-cache.js';

export type routerReqT = {
  verb: string,
  clientReq: {
    headers: Object,
    httpVersion: string,
    method: string,
    trailers: Object,
    statusCode: number,
    url: string
  },
  matches: string[]
};

export type routerResT = {
  clientRes: {
    setHeader: (name: string, value: string | string[]) => void,
    statusCode: number,
    end: Function
  },
  redirect: (path: string) => void
};

export default getRouter()
  .addStart(checkForProblems)
  .addStart(getSession)
  .addStart(getCache);
