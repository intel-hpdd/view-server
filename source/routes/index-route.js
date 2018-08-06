// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import viewRouter from '../view-router.js';
import indexHandlers from '../lib/index-handlers.js';
import checkGroup from '../lib/check-group.js';

export default () => {
  viewRouter
    .route('/ui/configureold/:subpath+')
    .get(checkGroup.fsAdmins)
    .get(indexHandlers.oldHandler);

  viewRouter
    .route('/ui/targetold/:id')
    .get(checkGroup.fsAdmins)
    .get(indexHandlers.oldHandler);

  viewRouter
    .route('/ui/storage_resourceold/:id')
    .get(checkGroup.fsAdmins)
    .get(indexHandlers.oldHandler);

  viewRouter
    .route('/ui/userold/:id')
    .get(checkGroup.fsUsers)
    .get(indexHandlers.oldHandler);

  viewRouter
    .route('/ui/system_statusold')
    .get(checkGroup.fsAdmins)
    .get(indexHandlers.oldHandler);

  viewRouter.get('/(.*)', indexHandlers.newHandler);
};
