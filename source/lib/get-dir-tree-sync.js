// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import fs from 'fs';
import path from 'path';

type strMap = {
  [key: string]: string
};

export default function getDirTreeSync(
  dir: string,
  transformPath: (x: string) => string,
  dirTree: strMap = {}
): strMap {
  return fs.readdirSync(dir).reduce((obj, file) => {
    const filePath = path.join(dir, file);
    const s = fs.statSync(filePath);

    if (s.isFile() && /\.html$/.test(filePath)) obj[transformPath(filePath)] = fs.readFileSync(filePath, 'utf8');
    if (s.isDirectory()) getDirTreeSync(`${filePath}/`, transformPath, obj);

    return obj;
  }, dirTree);
}
