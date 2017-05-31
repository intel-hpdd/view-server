// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import viewRouter from '../view-router.js';
import templates from '../lib/templates.js';
import apiRequest from '../lib/api-request.js';
import renderRequestError from '../lib/render-request-error.js';

const indexTemplate = templates['index.html'];

export default () => {
  viewRouter
    .route('/ui/login')
    /**
   * If the user is already authenticated and the eula is accepted, redirects to index page.
   * If the user is already authenticated and the eula is not accepted, logs the user out.
   * @param {Object} req
   * @param {Object} res
   * @param {Object} data
   * @param {Function} next
   */
    .get(function checkEula(req, res, data, next) {
      const session = data.cache.session;

      if (!session.user) return goToNext();

      if (session.user.eula_state === 'pass') return res.redirect('/ui/');
      else
        apiRequest({
          path: '/session',
          method: 'delete',
          headers: { cookie: data.cacheCookie }
        })
          .stopOnError(
            renderRequestError(
              res,
              err => 'Exception rendering resources: ' + err.stack
            )
          )
          .each(goToNext);

      function goToNext() {
        next(req, res, data.cache);
      }
    })
    /**
   * Renders the login page.
   * @param {Object} req
   * @param {Object} res
   * @param {Object} cache
   * @param {Function} next
   */
    .get(function renderLogin(req, res, cache, next) {
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
