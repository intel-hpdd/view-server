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

import * as fp from '@mfl/fp';

const valuesLens = fp.compose(
  fp.lensProp('methodResponse'),
  fp.lensProp('params'),
  fp.lensProp('param'),
  fp.lensProp('value'),
  fp.lensProp('array'),
  fp.lensProp('data'),
  fp.lensProp('value')
);

const overStructValues = fp.over(
  fp.compose(
    valuesLens,
    fp.mapped,
    fp.lensProp('struct'),
    fp.lensProp('member'),
    fp.mapped,
    fp.lensProp('value')
  )
)(function normalize(xs) {
  if (xs.string) return xs.string.text || '';
  else if (xs.int) return parseInt(xs.int.text, 10);
  else return xs;
});

const overStructs = fp.over(fp.compose(valuesLens, fp.mapped))(function(xs) {
  return xs.struct.member.reduce(function normalizeText(out, x) {
    out[x.name.text] = x.value;
    return out;
  }, {});
});

export default fp.flow(overStructValues, overStructs, fp.view(valuesLens));
