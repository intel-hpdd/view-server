// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import renderRequestError from '../lib/render-request-error.js';

import getStoppedServices from '../supervisor/get-stopped-supervisor-services.js';

import type { routerReqT, routerResT } from '../view-router.js';

export default function checkForProblems(
  req: routerReqT,
  res: routerResT,
  next: Function
) {
  getStoppedServices().toArray(stopped => {
    if (stopped.length === 0) return next(req, res);

    const description = `The following services are not running: \n\n${stopped.join(
      '\n'
    )}\n\n`;
    renderRequestError(res, () => description)(new Error());
  });
}
