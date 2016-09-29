// @flow

import GROUPS from '../../../source/lib/groups.js';
import checkGroup from '../../../source/lib/check-group.js';

import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect
} from '../../jasmine.js';

describe('check group', function () {
  let req,
    res,
    data,
    next;

  beforeEach(function () {
    req = {};
    res = {
      redirect: jasmine.createSpy('redirect')
    };
    data = {
      cache: {
        session: {}
      }
    };
    next = jasmine.createSpy('next');
  });

  it('should return the expected interface', function () {
    expect(checkGroup).toEqual({
      superusers: jasmine.any(Function),
      fsAdmins: jasmine.any(Function),
      fsUsers: jasmine.any(Function)
    });
  });

  it('should allow superusers', function () {
    data.cache.session.user = {
      groups: [
        { name: GROUPS.SUPERUSERS }
      ]
    };

    checkGroup.superusers(req, res, data, next);

    expect(next).toHaveBeenCalledOnceWith(req, res, data);
  });

  it('should redirect fs admins', function () {
    data.cache.session.user = {
      groups: [
        { name: GROUPS.FS_ADMINS }
      ]
    };

    checkGroup.superusers(req, res, data, next);

    expect(res.redirect).toHaveBeenCalledOnceWith('/ui/');
  });

  it('should redirect fs users', function () {
    data.cache.session.user = {
      groups: [
        { name: GROUPS.FS_USERS }
      ]
    };

    checkGroup.superusers(req, res, data, next);

    expect(res.redirect).toHaveBeenCalledOnceWith('/ui/');
  });
});