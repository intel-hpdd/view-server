// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@mfl/fp';
import highland from 'highland';
import childProcess from 'child_process';

import type { HighlandStreamT } from 'highland';

const exec: (
  x: string
) => HighlandStreamT<string | Buffer> = highland.wrapCallback(
  childProcess.exec
);

export default () =>
  highland(['m', 'n', 'r', 's', 'v'])
    .flatMap(arg => exec(`uname -${arg}`))
    .map(x => x.toString().trim())
    .collect()
    .map(
      fp.zipObject(['sysname', 'nodename', 'release', 'version', 'machine'])
    );
