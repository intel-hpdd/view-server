// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getReq from '@mfl/req';

import type { HighlandStreamT } from 'highland';

const req = getReq('http');

const body =
  '<?xml version="1.0"?>\
<methodCall>\
  <methodName>supervisor.getAllProcessInfo</methodName>\
  <params>\
  </params>\
</methodCall>';

export default (auth: ?string): HighlandStreamT<Object> => {
  let options = {
    port: 9100,
    method: 'POST',
    path: '/RPC2'
  };

  if (auth)
    options = Object.assign({}, options, {
      auth
    });

  return req.bufferRequest(options, new Buffer(body));
};
