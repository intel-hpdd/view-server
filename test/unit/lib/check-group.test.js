// @flow

import GROUPS from '../../../source/lib/groups.js';
import checkGroup from '../../../source/lib/check-group.js';

describe('check group', function() {
  let req, res, data, next;

  beforeEach(function() {
    req = {};
    res = {
      redirect: jest.fn()
    };
    data = {
      cache: {
        session: {}
      }
    };
    next = jest.fn();
  });

  it('should return the expected interface', function() {
    expect(checkGroup).toEqual({
      superusers: expect.any(Function),
      fsAdmins: expect.any(Function),
      fsUsers: expect.any(Function)
    });
  });

  it('should allow superusers', function() {
    data.cache.session.user = {
      groups: [{ name: GROUPS.SUPERUSERS }]
    };

    checkGroup.superusers(req, res, data, next);

    expect(next).toHaveBeenCalledOnceWith(req, res, data);
  });

  it('should redirect fs admins', function() {
    data.cache.session.user = {
      groups: [{ name: GROUPS.FS_ADMINS }]
    };

    checkGroup.superusers(req, res, data, next);

    expect(res.redirect).toHaveBeenCalledOnceWith('/ui/');
  });

  it('should redirect fs users', function() {
    data.cache.session.user = {
      groups: [{ name: GROUPS.FS_USERS }]
    };

    checkGroup.superusers(req, res, data, next);

    expect(res.redirect).toHaveBeenCalledOnceWith('/ui/');
  });
});
