describe('view server', () => {
  let mockHttp, mockHttps, close, server, mockLoginRoute, mockIndexRoute, mockViewRouter, mockConf, mockApi;

  beforeEach(() => {
    server = {
      listen: jest.fn(function s() {
        return server;
      }),
      on: jest.fn()
    };

    mockHttp = {
      createServer: jest.fn(() => server),
      globalAgent: {
        maxSockets: {}
      }
    };
    jest.mock('http', () => mockHttp);

    mockHttps = {
      globalAgent: {
        maxSockets: {}
      }
    };
    jest.mock('https', () => mockHttps);

    mockViewRouter = {
      go: jest.fn()
    };
    jest.mock('../../source/view-router.js', () => mockViewRouter);

    mockConf = {
      VIEW_SERVER_PORT: 8900
    };
    jest.mock('../../source/conf.js', () => mockConf);

    mockLoginRoute = jest.fn();
    jest.mock('../../source/routes/login-route.js', () => mockLoginRoute);

    mockIndexRoute = jest.fn();
    jest.mock('../../source/routes/index-route.js', () => mockIndexRoute);

    mockApi = {
      waitForRequests: jest.fn()
    };
    jest.mock('../../source/lib/api-request.js', () => mockApi);

    close = require('../../source/view-server').default();
  });

  it('should return a close function', () => {
    expect(close).toEqual(expect.any(Function));
  });

  it('should call loginRoute', () => {
    expect(mockLoginRoute).toHaveBeenCalledTimes(1);
  });

  it('should call indexRoute', () => {
    expect(mockIndexRoute).toHaveBeenCalledTimes(1);
  });

  it('should call createServer', () => {
    expect(mockHttp.createServer).toHaveBeenCalledOnceWith(expect.any(Function));
  });

  it('should listen on the view server port', () => {
    expect(server.listen).toHaveBeenCalledOnceWith(8900);
  });

  describe('routing requests', () => {
    let req, res;

    beforeEach(() => {
      req = {
        url: '/foo/bar',
        method: 'get'
      };

      res = {
        writeHead: jest.fn(),
        end: jest.fn(),
        setHeader: jest.fn()
      };

      const handler = mockHttp.createServer.mock.calls[0][0];

      handler(req, res);
    });

    it('should call the view router', () => {
      expect(mockViewRouter.go).toHaveBeenCalledOnceWith(
        req.url,
        {
          verb: req.method,
          clientReq: req
        },
        {
          clientRes: res,
          redirect: expect.any(Function)
        }
      );
    });

    describe('redirecting', () => {
      beforeEach(() => {
        mockViewRouter.go.mock.calls[0][2].redirect('/');
      });

      it('should have a method to redirect on the response object', () => {
        expect(res.writeHead).toHaveBeenCalledOnceWith(302, { Location: '/' });
      });

      it('should set a Content-Security-Policy header', () => {
        expect(res.setHeader).toHaveBeenCalledOnceWith(
          'Content-Security-Policy',
          "default-src 'none';\
 child-src 'self';\
 script-src 'self' 'unsafe-inline' 'unsafe-eval';\
 connect-src 'self' wss:;\
 img-src 'self' data:;\
 font-src 'self';\
 style-src 'self' 'unsafe-inline';"
        );
      });

      it('should end the response', () => {
        expect(res.end).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('closing', () => {
    let spy, fn;

    beforeEach(() => {
      spy = jest.fn();

      close(spy);

      fn = server.on.mock.calls[0][1];
    });

    it('should register a close event', () => {
      expect(server.on).toHaveBeenCalledOnceWith('close', expect.any(Function));
    });

    it('should throw if server close throws', () => {
      const fn = server.on.mock.calls[0][1];

      expect(expectToThrow).toThrow(new Error('boom!'));

      function expectToThrow() {
        fn(new Error('boom!'));
      }
    });

    it('should wait for api requests', () => {
      fn();
      expect(mockApi.waitForRequests).toHaveBeenCalledOnceWith(spy);
    });
  });
});
