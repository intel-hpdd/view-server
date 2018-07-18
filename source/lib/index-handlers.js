// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import templates from './templates.js';
import conf from '../conf.js';
import cspPolicy from './csp-policy.js';

import type { routerReqT, routerResT } from '../view-router.js';

import type { dataT } from '../middleware/get-session.js';

const handler = template => (
  req: routerReqT,
  res: routerResT,
  data: dataT,
  next: Function
) => {
  const session = data.cache.session;

  if (!session.user && !conf.ALLOW_ANONYMOUS_READ)
    return res.redirect('/ui/login/');

  res.clientRes.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.clientRes.setHeader('Content-Security-Policy', cspPolicy);
  res.clientRes.statusCode = 200;

  const rendered = template({
    title: '',
    cache: data.cache
  });

  res.clientRes.end(rendered);

  next(req, res);
};

const newTemplate = templates['index.html'];
const oldTemplate = templates['base.html'];

export default {
  oldHandler: handler(oldTemplate),
  newHandler: handler(newTemplate)
};
