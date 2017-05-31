// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

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
