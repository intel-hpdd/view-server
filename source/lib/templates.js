// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as obj from "@iml/obj";
import { templateSettings, template } from "lodash";
import getDirTreeSync from "./get-dir-tree-sync.js";
import conf from "../conf.js";

const transformPath = root => p => p.replace(root, "");
const templates = {
  ...getDirTreeSync(conf.TEMPLATE_ROOT_OLD, transformPath(conf.TEMPLATE_ROOT_OLD)),
  ...getDirTreeSync(conf.TEMPLATE_ROOT_NEW, transformPath(conf.TEMPLATE_ROOT_NEW))
};

templateSettings.imports = {
  ...templateSettings.imports,
  t(name, data) {
    return templateMap[name](data);
  },
  conf,
  getServerDate() {
    return new Date();
  }
};

templateSettings.interpolate = /<\$=([\s\S]+?)\$>/g;
templateSettings.escape = /<\$-([\s\S]+?)\$>/g;
templateSettings.evaluate = /<\$([\s\S]+?)\$>/g;

type fnMap = {
  [key: string]: Function
};

const templateMap: fnMap = obj.reduce(
  () => ({}),
  (val: string, key: string, out: fnMap): fnMap => {
    out[key] = template(val);

    return out;
  },
  templates
);

export default templateMap;
