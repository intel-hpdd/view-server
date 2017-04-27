import proxyquire from '../proxyquire.js';

import { describe, beforeEach, it, jasmine, expect } from '../jasmine.js';

describe('view router', () => {
  let getRouter, router, checkForProblems, getSession, getCache, instance;

  beforeEach(() => {
    router = {
      addStart: jasmine.createSpy('addStart').and.callFake(r)
    };

    getRouter = jasmine.createSpy('getRouter').and.callFake(r);

    checkForProblems = function checkForProblems() {};
    getSession = function getSession() {};
    getCache = function getCache() {};

    instance = proxyquire('../source/view-router', {
      '@mfl/router': getRouter,
      './middleware/check-for-problems.js': checkForProblems,
      './middleware/get-session.js': getSession,
      './middleware/get-cache.js': getCache
    }).default;

    function r() {
      return router;
    }
  });

  it('should return a router', () => {
    expect(instance).toEqual(router);
  });

  it('should check for problems on start', () => {
    expect(router.addStart).toHaveBeenCalledOnceWith(checkForProblems);
  });

  it('should get the session on start', () => {
    expect(router.addStart).toHaveBeenCalledOnceWith(getSession);
  });

  it('should get the cache on start', () => {
    expect(router.addStart).toHaveBeenCalledOnceWith(getCache);
  });
});
