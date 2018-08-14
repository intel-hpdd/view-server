describe('login route', () => {
  let mockViewRouter, mockTemplates, req, res, next, pathRouter;

  beforeEach(() => {
    req = {};

    res = {
      redirect: jest.fn(),
      clientRes: {
        setHeader: jest.fn(),
        end: jest.fn()
      }
    };

    next = jest.fn();

    mockTemplates = {
      'index.html': jest.fn(() => 'foo')
    };
    jest.mock('../../../source/lib/templates.js', () => mockTemplates);

    pathRouter = {
      get: jest.fn(() => {
        return pathRouter;
      })
    };

    mockViewRouter = {
      route: jest.fn(() => pathRouter)
    };
    jest.mock('../../../source/view-router.js', () => mockViewRouter);

    require('../../../source/routes/login-route').default();
  });

  it('should register a path for the login route', () => {
    expect(mockViewRouter.route).toHaveBeenCalledOnceWith('/ui/login');
  });

  describe('render login', () => {
    beforeEach(() => {
      const handler = pathRouter.get.mock.calls[1][0];
      handler(req, res, {}, next);
    });

    it('should set the header', () => {
      expect(res.clientRes.setHeader).toHaveBeenCalledOnceWith('Content-Type', 'text/html; charset=utf-8');
    });

    it('should set the statusCode', () => {
      expect(res.clientRes.statusCode).toBe(200);
    });

    it('should render the body', () => {
      expect(res.clientRes.end).toHaveBeenCalledOnceWith('foo');
    });

    it('should render the template', () => {
      expect(mockTemplates['index.html']).toHaveBeenCalledOnceWith({
        title: 'Login',
        cache: {}
      });
    });

    it('should call next', () => {
      expect(next).toHaveBeenCalledOnceWith(req, res);
    });
  });
});
