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

import templates from './templates.js';
import conf from '../conf.js';
import cspPolicy from './csp-policy.js';

import type {
  routerReqT,
  routerResT
} from '../view-router.js';

import type {
  dataT
} from '../middleware/get-session.js';

const handler = (template) =>
  (req:routerReqT, res:routerResT, data:dataT, next:Function) => {
    let session = data.cache.session;

    if (!session.user && !conf.ALLOW_ANONYMOUS_READ)
      return res.redirect('/ui/login/');

    res.clientRes.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.clientRes.setHeader('Content-Security-Policy', cspPolicy);
    res.clientRes.statusCode = 200;

    let rendered = template({
      title: '',
      cache: data.cache
    });

    res.clientRes.end(rendered);

    next(req, res);
  };

const newTemplate = templates['new/index.html'];
const oldTemplate = templates['base.html'];

export default {
  oldHandler: handler(oldTemplate),
  newHandler: handler(newTemplate)
};
