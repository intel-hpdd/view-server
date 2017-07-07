import highland from 'highland';

describe('login route', () => {
  let mockViewRouter,
    mockTemplates,
    req,
    res,
    next,
    push,
    mockApiRequest,
    pathRouter,
    mockRenderRequestError,
    renderRequestErrorInner;

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

    mockApiRequest = jest.fn(() =>
      highland(_push_ => {
        push = _push_;
      })
    );
    jest.mock('../../../source/lib/api-request.js', () => mockApiRequest);

    renderRequestErrorInner = jest.fn();

    mockRenderRequestError = jest.fn(() => renderRequestErrorInner);

    jest.mock(
      '../../../source/lib/render-request-error.js',
      () => mockRenderRequestError
    );

    require('../../../source/routes/login-route').default();
  });

  it('should register a path for the login route', () => {
    expect(mockViewRouter.route).toHaveBeenCalledOnceWith('/ui/login');
  });

  describe('eula checking', () => {
    let handler, data;

    beforeEach(() => {
      data = {
        cacheCookie: 'foo',
        cache: {
          session: {}
        }
      };

      handler = pathRouter.get.mock.calls[0][0];
    });

    it('should go to next if user is undefined', () => {
      handler(req, res, data, next);

      expect(next).toHaveBeenCalledOnceWith(req, res, data.cache);
    });

    it('should redirect if the user exists and accepted eula', () => {
      data.cache.session.user = {
        eula_state: 'pass'
      };

      handler(req, res, data, next);

      expect(res.redirect).toHaveBeenCalledOnceWith('/ui/');
    });

    describe('deleting session', () => {
      beforeEach(() => {
        data.cache.session.user = {
          eula_state: 'eula'
        };

        handler(req, res, data, next);
      });

      it('should send a delete request', () => {
        expect(mockApiRequest).toHaveBeenCalledOnceWith({
          path: '/session',
          method: 'delete',
          headers: { cookie: 'foo' }
        });
      });

      it('should call next', () => {
        push(null, []);
        push(null, highland.nil);

        expect(next).toHaveBeenCalledOnceWith(req, res, data.cache);
      });

      it('should render errors', () => {
        push(new Error('boom!'));
        push(null, highland.nil);

        expect(renderRequestErrorInner).toHaveBeenCalledOnceWith(
          new Error('boom!'),
          expect.any(Function)
        );
      });
    });
  });

  describe('render login', () => {
    beforeEach(() => {
      const handler = pathRouter.get.mock.calls[1][0];
      handler(req, res, {}, next);
    });

    it('should set the header', () => {
      expect(res.clientRes.setHeader).toHaveBeenCalledOnceWith(
        'Content-Type',
        'text/html; charset=utf-8'
      );
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
