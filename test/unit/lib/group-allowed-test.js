// @flow

import groupAllowed from '../../../source/lib/group-allowed.js';
import GROUPS from '../../../source/lib/groups.js';

import {
  describe,
  it,
  expect
} from '../../jasmine.js';

describe('group allowed', () => {
  it('should disallow no session', () => {
    expect(groupAllowed(GROUPS.FS_USERS, null)).toBeFalsy();
  });

  it('should disallow fs users and admins for superuser level permissions', () => {
    expect(groupAllowed(GROUPS.SUPERUSERS, {
      user: {
        groups: [
          { name: GROUPS.FS_ADMINS },
          { name: GROUPS.FS_USERS }
        ]
      }
    })).toBe(false);
  });

  it('should allow superusers', () => {
    expect(groupAllowed(GROUPS.SUPERUSERS, {
      user: {
        groups: [
          { name: GROUPS.FS_ADMINS },
          { name: GROUPS.FS_USERS },
          { name: GROUPS.SUPERUSERS }
        ]
      }
    })).toBe(true);
  });

  it('should allow fs users', () => {
    expect(groupAllowed(GROUPS.FS_USERS, {
      user: {
        groups: [
          { name: GROUPS.FS_USERS }
        ]
      }
    })).toBe(true);
  });

  it('should allow fs admins', () => {
    expect(groupAllowed(GROUPS.FS_ADMINS, {
      user: {
        groups: [
          { name: GROUPS.FS_ADMINS }
        ]
      }
    })).toBe(true);
  });
});
