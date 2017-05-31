// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';
import childProcess from 'child_process';
import crypto from 'crypto';
import conf from '../conf.js';

import type { HighlandStreamT } from 'highland';

let credentials: string[];
const command = 'python -c "import settings; print settings.SECRET_KEY"';

const exec = highland.wrapCallback(childProcess.exec);

export default (): HighlandStreamT<string | null> => {
  if (conf.NODE_ENV === 'production') return highland([null]);

  let credentialsStream: HighlandStreamT<string>;

  if (credentials) {
    credentialsStream = highland(credentials);
  } else {
    const userStream: HighlandStreamT<string> = exec(command, {
      cwd: conf.SITE_ROOT
    })
      .map(x => x.toString().trim())
      .through(getHash())
      .map((x: string) => x.slice(0, 7));

    const passwordStream = userStream.observe().through(getHash());

    credentialsStream = highland([userStream, passwordStream]).sequence();
  }

  return credentialsStream
    .collect()
    .tap(c => (credentials = c))
    .map(c => c.join(':'))
    .stopOnError(console.log); // eslint-disable-line no-console

  function getHash(): crypto$Hash {
    const hash = crypto.createHash('md5');
    hash.setEncoding('hex');

    return hash;
  }
};
