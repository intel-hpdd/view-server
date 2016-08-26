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

import apiRequest from '../lib/api-request.js';
import renderRequestError from '../lib/render-request-error.js';

import type {
  routerReqT,
  routerResT
} from '../view-router.js';

export type dataT = {
  session:Object,
  cacheCookie:string,
  cache:Object
};

export default (req:routerReqT, res:routerResT, next:Function) => {
  const cookie:string = req.clientReq.headers.cookie || '';

  apiRequest(
    '/session',
    {
      headers: {
        cookie
      }
    }
  )
  .stopOnError(
    renderRequestError(
      res,
      (err:Error) => `Exception rendering resources: ${err.stack}`
    )
  )
  .each((response) => {
    // Pass the session cookies to the client.
    res.clientRes.setHeader('Set-Cookie', response.headers['set-cookie']);

    let data:dataT = {
      session: response.body,
      cache: {},
      cacheCookie: response
        .headers['set-cookie']
        .map((cookieString) =>
          cookieString.match(/((?:csrftoken|sessionid)=[^;]+;)/)[0]
        )
        .join(' ')
    };

    next(req, res, data);
  });
};
