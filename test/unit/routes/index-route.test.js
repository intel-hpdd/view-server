describe('index route', () => {
  let mockIndexHandlers, mockCheckGroup, mockViewRouter;

  beforeEach(() => {
    mockIndexHandlers = {
      oldHandler: jest.fn(),
      newHandler: jest.fn()
    };

    jest.mock('../../../source/lib/index-handlers.js', () => mockIndexHandlers);

    mockCheckGroup = {
      fsAdmins: jest.fn(),
      fsUsers: jest.fn()
    };

    jest.mock('../../../source/lib/check-group.js', () => mockCheckGroup);

    const pathRouter = {
      get: jest.fn(() => pathRouter)
    };

    mockViewRouter = {
      get: jest.fn(),
      route: jest.fn(() => pathRouter)
    };

    jest.mock('../../../source/view-router.js', () => mockViewRouter);

    require('../../../source/routes/index-route.js').default();
  });

  it('should call view-router route', () => {
    expect(mockViewRouter.route).toHaveBeenCalled();
  });
});
