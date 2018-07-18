// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getUname from './get-uname.js';
import templates from './templates.js';

import type { routerResT } from '../view-router.js';

const backendErrorTemplate = templates['backend_error.html'];

type fnToStringT = (err: Error) => string;

export default (res: routerResT, descriptionFn: fnToStringT) => (
  err: Error
) => {
  const description = descriptionFn(err);

  getUname().each(map => {
    const rendered = backendErrorTemplate({
      description,
      debug_info: map
    });

    res.clientRes.end(rendered);
  });
};
