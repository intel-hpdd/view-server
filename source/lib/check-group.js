// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@mfl/fp';
import groupAllowed from './group-allowed';
import groups from './groups';

const allowGroup = (groupName: string) => (req, res, data, next) => {
  if (!groupAllowed(groupName, data.cache.session)) return res.redirect('/ui/');

  next(req, res, data);
};

const transform = text =>
  text
    .toLowerCase()
    .split('_')
    .reduce((str, part) => (str += capitalize(part)));

const capitalize = x => x.charAt(0).toUpperCase() + x.slice(1);

const keys = [];
const vals = [];

Object.keys(groups).forEach(key => {
  keys.push(transform(key));
  vals.push(allowGroup(groups[key]));
});

export default fp.zipObject(keys)(vals);
