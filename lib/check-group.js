//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
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

'use strict';

var fp = require('intel-fp');
var groupAllowed = require('./group-allowed');
var groups = require('./groups');

var allowGroup = fp.curry(5, function allowGroup (groupName, req, res, data, next) {
  if (!groupAllowed(groupName, data.cache.session))
    return res.redirect('/ui/');

  next(req, res, data);
});

var keys = [];
var vals = [];

Object.keys(groups)
  .forEach(function buildChecker (key) {
    keys.push(transform(key));
    vals.push(allowGroup(groups[key]));
});

module.exports = fp.zipObject(keys, vals);

function transform (text) {
  return text.toLowerCase().split('_').reduce(function convert (str, part) {
    return str += capitalize(part);
  });
}

function capitalize (x) {
  return x.charAt(0).toUpperCase() + x.slice(1);
}
