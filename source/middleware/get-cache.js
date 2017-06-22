// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@mfl/fp';
import highland from 'highland';
import conf from '../conf.js';
import apiRequest from '../lib/api-request.js';
import renderRequestError from '../lib/render-request-error.js';

import type { routerReqT, routerResT } from '../view-router.js';

import type { dataT } from './get-session.js';

export default (
  req: routerReqT,
  res: routerResT,
  data: dataT,
  next: Function
) => {
  let cache;
  const calls = [
    { path: '/filesystem', qs: {} },
    { path: '/target', qs: {} },
    { path: '/host', qs: {} },
    { path: '/power_control_type', qs: {} },
    { path: '/server_profile', qs: {} },
    {
      path: '/lnet_configuration',
      qs: {
        dehydrate__host: false
      }
    },
    {
      path: '/alert',
      jsonMask: 'objects(affected,message)',
      qs: {
        active: true
      }
    },
    {
      path: '/job',
      jsonMask: 'objects(write_locks,read_locks,description)',
      qs: {
        state__in: ['pending', 'tasked']
      }
    }
  ];

  if (data.session.user != null || conf.ALLOW_ANONYMOUS_READ)
    cache = highland(calls)
      .map(({ qs = {}, ...rest }) => {
        return apiRequest({
          headers: {
            Cookie: data.cacheCookie
          },
          qs: {
            limit: 0,
            ...qs
          },
          ...rest
        });
      })
      .parallel(calls.length)
      .pluck('body')
      .pluck('objects');
  else cache = highland(fp.times(fp.always([]))(calls.length));

  cache
    .collect()
    .map(fp.zipObject(calls.map(call => call.path.slice(1))))
    .stopOnError(
      renderRequestError(
        res,
        (err: Error): string => `Exception rendering resources: ${err.stack}`
      )
    )
    .each(cache => {
      cache.session = data.session;

      data.cache = cache;

      next(req, res, data);
    });
};
