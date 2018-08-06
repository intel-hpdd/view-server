// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import viewRouter from '../view-router.js';
import templates from '../lib/templates.js';

const indexTemplate = templates['index.html'];

export default () => {
  viewRouter
    .route('/ui/login')
    .get((req, res, data, next) => {
      const session = data.cache.session;

      if (session.user) return res.redirect('/ui/');

      next(req, res, data.cache);
    })
    .get((req, res, cache, next) => {
      res.clientRes.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.clientRes.statusCode = 200;

      const rendered = indexTemplate({
        title: 'Login',
        cache: cache
      });

      res.clientRes.end(rendered);

      next(req, res);
    });
};
