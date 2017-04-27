import {
  describe,
  beforeEach,
  jasmine,
  jest,
  it,
  expect
} from '../../jasmine.js';

describe('index route', () => {
  let mockIndexHandlers, mockCheckGroup, mockViewRouter;

  beforeEach(() => {
    mockIndexHandlers = {
      oldHandler: jasmine.createSpy('oldHandler'),
      newHandler: jasmine.createSpy('newHandler')
    };

    jest.mock('../source/lib/index-handlers.js', () => mockIndexHandlers);

    mockCheckGroup = {
      fsAdmins: jasmine.createSpy('fsAdmins'),
      fsUsers: jasmine.createSpy('fsUsers')
    };

    jest.mock('../source/lib/check-group.js', () => mockCheckGroup);

    const pathRouter = {
      get: jasmine.createSpy('get').and.callFake(() => pathRouter)
    };

    mockViewRouter = {
      get: jasmine.createSpy('get'),
      route: jasmine.createSpy('route').and.returnValue(pathRouter)
    };

    jest.mock('../source/view-router.js', () => mockViewRouter);

    require('../../../source/routes/index-route.js').default();
  });

  it('should call view-router route', () => {
    expect(mockViewRouter.route).toHaveBeenCalled();
  });
});
