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

import * as fp from 'intel-fp';
import * as obj from 'intel-obj';
import through from 'intel-through';
import highland from 'highland';
import conf from '../conf.js';
import apiRequest from '../lib/api-request.js';
import renderRequestError from '../lib/render-request-error.js';

import type {
  routerReqT,
  routerResT
} from '../view-router.js';

import type {
  dataT
} from './get-session.js';

export default (req:routerReqT, res:routerResT, data:dataT, next:Function) => {
  let cache;
  const calls = [
    ['filesystem', {}],
    ['target', {}],
    ['host', {}],
    ['power_control_type', {}],
    ['server_profile', {}],
    ['lnet_configuration', {
      qs: {
        dehydrate__host: false
      }
    }],
    ['alert', {
      jsonMask: 'objects(affected,message)',
      qs: {
        active: true
      }
    }],
    ['job', {
      jsonMask: 'objects(write_locks,read_locks,description)',
      qs: {
        state__in: ['pending', 'tasked']
      }
    }]
  ];

  if (data.session.user != null || conf.ALLOW_ANONYMOUS_READ)
    cache = highland(calls)
      .map((call) => {
        return apiRequest(
          `/${call[0]}`,
          obj.merge(
            {
              headers: {
                Cookie: data.cacheCookie
              },
              qs: {
                limit: 0
              }
            },
            call[1]
          )
        );
      })
      .parallel(calls.length)
      .pluck('body')
      .pluck('objects');
  else
    cache = highland(
      fp.times(
        fp.always([]),
        calls.length
      )
    );

  cache
    .through(through.zipObject(
      calls.map((call) => call[0])
    ))
    .stopOnError(
      renderRequestError(
        res,
        (err:Error):string =>
          `Exception rendering resources: ${err.stack}`
      )
    )
    .each((cache) => {
      cache.session = data.session;

      data.cache = cache;

      next(req, res, data);
    });
};
