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
