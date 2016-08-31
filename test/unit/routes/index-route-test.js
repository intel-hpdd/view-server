import proxyquire from '../../proxyquire.js';

import {
  describe,
  beforeEach,
  jasmine
} from '../../jasmine.js';

describe('index route', () => {
  let indexHandlers,
    checkGroup,
    viewRouter;

  beforeEach(() => {
    indexHandlers = {
      oldHandler: jasmine.createSpy('oldHandler'),
      newHandler: jasmine.createSpy('newHandler')
    };

    checkGroup = {
      fsAdmins: jasmine.createSpy('fsAdmins'),
      fsUsers: jasmine.createSpy('fsUsers')
    };

    const pathRouter = {
      get: jasmine
        .createSpy('get')
        .and
        .callFake(() => pathRouter)
    };

    viewRouter = {
      get: jasmine.createSpy('get'),
      route: jasmine.createSpy('route').and.returnValue(pathRouter)
    };

    proxyquire('../source/routes/index-route', {
      '../view-router.js': viewRouter,
      '../lib/index-handlers.js': indexHandlers,
      '../lib/check-group.js': checkGroup
    }).default();
  });
});
