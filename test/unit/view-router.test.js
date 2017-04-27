import { describe, beforeEach, it, jasmine, expect, jest } from '../jasmine.js';

describe('view router', () => {
  let mockGetRouter,
    router,
    mockCheckForProblems,
    mockGetSession,
    mockGetCache,
    instance;

  beforeEach(() => {
    router = {
      addStart: jasmine.createSpy('addStart').and.callFake(r)
    };

    mockGetRouter = jasmine.createSpy('getRouter').and.callFake(r);
    jest.mock('@mfl/router', () => mockGetRouter);

    mockCheckForProblems = function checkForProblems() {};
    jest.mock(
      '../source/middleware/check-for-problems.js',
      () => mockCheckForProblems
    );

    mockGetSession = function getSession() {};
    jest.mock('../source/middleware/get-session.js', () => mockGetSession);

    mockGetCache = function getCache() {};
    jest.mock('../source/middleware/get-cache', () => mockGetCache);

    instance = require('../../source/view-router').default;

    function r() {
      return router;
    }
  });

  it('should return a router', () => {
    expect(instance).toEqual(router);
  });

  it('should check for problems on start', () => {
    expect(router.addStart).toHaveBeenCalledOnceWith(mockCheckForProblems);
  });

  it('should get the session on start', () => {
    expect(router.addStart).toHaveBeenCalledOnceWith(mockGetSession);
  });

  it('should get the cache on start', () => {
    expect(router.addStart).toHaveBeenCalledOnceWith(mockGetCache);
  });
});
