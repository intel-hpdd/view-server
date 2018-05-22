// @flow

//
// Copyright (c) 2018 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import childProcess from 'child_process';
import highland from 'highland';

import type { HighlandStreamT } from 'highland';

const exec: (
  x: string
) => HighlandStreamT<string | Buffer> = highland.wrapCallback(
  childProcess.exec
);

export default (): HighlandStreamT<string> =>
  exec('systemctl list-units --all | grep iml-* | grep .service')
    .map(x => x.toString().trim())
    .flatMap(x => x.split('\n'))
    .map(x => x.split(/\s+/, 4))
    .filter(([, , state]) => state !== 'active')
    .map(([name]) => name)
    .errors((err: Error, push) => {
      push(null, 'systemctl');
    });
