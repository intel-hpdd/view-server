// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import net from 'net';
import highland from 'highland';
import type { HighlandStreamT } from 'highland';

export default (): HighlandStreamT<string> => {
  const c = net.connect('/var/run/supervisor-status.sock');
  return highland(c)
    .collect()
    .map(xs => xs.join(''))
    .map(JSON.parse)
    .map(x => {
      if (x.result) return x.result;
      else throw new Error('supervisor status service returned an error.');
    })
    .flatten()
    .filter(service => service.statename !== 'RUNNING')
    .pluck('name')
    .errors((err: Error, push) => {
      push(null, 'supervisor');
    });
};
