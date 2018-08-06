// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import url from 'url';
import getReq from '@iml/req';
import conf from '../conf.js';

import type { HighlandStreamT } from 'highland';
import type { InputOptions, JsonResponse } from '@iml/req';

const req = getReq('https');

const serverHttpUrl = url.parse(conf.SERVER_HTTP_URL);

export default (options: InputOptions): HighlandStreamT<JsonResponse> => {
  const path = options.path.replace(/^\/*/, '/').replace(/\/*$/, '/');

  const opts = {
    ...options,
    localhost: serverHttpUrl.href,
    host: serverHttpUrl.host,
    hostname: serverHttpUrl.hostname,
    port: serverHttpUrl.port,
    path: `/api${path}`
  };

  return req.bufferJsonRequest(opts);
};

export const waitForRequests = req.waitForRequests;
