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

import * as obj from 'intel-obj';
import _ from 'lodash';
import getDirTreeSync from './get-dir-tree-sync.js';
import conf from '../conf.js';

const transformPath = (root) => (p) => p.replace(root, '');
const templates = {
  ...getDirTreeSync(conf.TEMPLATE_ROOT_OLD, transformPath(conf.TEMPLATE_ROOT_OLD)),
  ...getDirTreeSync(conf.TEMPLATE_ROOT_NEW, transformPath(conf.TEMPLATE_ROOT_NEW))
};

_.templateSettings.imports = {
  _,
  t (name, data) {
    return templateMap[name](data);
  },
  conf,
  getServerDate () {
    return new Date();
  }
};

_.templateSettings.interpolate =  /<\$=([\s\S]+?)\$>/g;
_.templateSettings.escape =  /<\$-([\s\S]+?)\$>/g;
_.templateSettings.evaluate =  /<\$([\s\S]+?)\$>/g;

type fnMap = {
  [key:string]:Function
};

const templateMap:fnMap = obj.reduce(
  () => ({}),
  (val:string, key:string, out:fnMap):fnMap => {
    out[key] = _.template(val);

    return out;
  },
  templates
);

export default templateMap;
