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

import getRouter from '@mfl/router';

import checkForProblems from './middleware/check-for-problems.js';
import getSession from './middleware/get-session.js';
import getCache from './middleware/get-cache.js';

export type routerReqT = {
  verb: string,
  clientReq: {
    headers: Object,
    httpVersion: string,
    method: string,
    trailers: Object,
    statusCode: number,
    url: string
  },
  matches: string[]
};

export type routerResT = {
  clientRes: {
    setHeader: (name: string, value: string | string[]) => void,
    statusCode: number,
    end: Function
  },
  redirect: (path: string) => void
};

export default getRouter()
  .addStart(checkForProblems)
  .addStart(getSession)
  .addStart(getCache);
