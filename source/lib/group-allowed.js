// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import groups from './groups.js';

type groupT = {
  name: string
};

type Session = {
  user: {
    groups: groupT[]
  }
};

export default (
  groupName: string,
  session: Session = { user: { groups: [] } }
): boolean =>
  session.user.groups.some(group => {
    //Superusers can do everything.
    if (group.name === groups.SUPERUSERS) return true;

    //Filesystem administrators can do everything a filesystem user can do.
    if (group.name === groups.FS_ADMINS && groupName === groups.FS_USERS)
      return true;

    // Fallback to matching on names.
    return group.name === groupName;
  });
