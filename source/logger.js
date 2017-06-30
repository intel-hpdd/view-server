// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import path from 'path';
import { default as logger, serializers, LEVELS } from '@iml/logger';
import conf from './conf.js';

const level = conf.NODE_ENV === 'production' ? LEVELS.ERROR : LEVELS.INFO;

export default logger({
  name: 'view_server',
  path: path.join(conf.LOG_PATH, conf.LOG_FILE),
  level,
  serializers
});
