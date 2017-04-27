import { describe, beforeEach, it, jasmine, expect, jest } from '../jasmine.js';

describe('view server', () => {
  let mockHttp,
    mockHttps,
    close,
    server,
    mockLoginRoute,
    mockIndexRoute,
    mockViewRouter,
    mockConf,
    mockApi;

  beforeEach(() => {
    server = {
      listen: jasmine.createSpy('listen').and.callFake(function s() {
        return server;
      }),
      on: jasmine.createSpy('on')
    };

    mockHttp = {
      createServer: jasmine.createSpy('createServer').and.returnValue(server),
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
      go: jasmine.createSpy('go')
    };
    jest.mock('../source/view-router.js', () => mockViewRouter);

    mockConf = {
      VIEW_SERVER_PORT: 8900
    };
    jest.mock('../source/conf.js', () => mockConf);

    mockLoginRoute = jasmine.createSpy('loginRoute');
    jest.mock('../source/routes/login-route.js', () => mockLoginRoute);

    mockIndexRoute = jasmine.createSpy('indexRoute');
    jest.mock('../source/routes/index-route.js', () => mockIndexRoute);

    mockApi = {
      waitForRequests: jasmine.createSpy('waitForRequests')
    };
    jest.mock('../source/lib/api-request.js', () => mockApi);

    close = require('../../source/view-server').default();
  });

  it('should return a close function', () => {
    expect(close).toEqual(jasmine.any(Function));
  });

  it('should call loginRoute', () => {
    expect(mockLoginRoute).toHaveBeenCalledOnce();
  });

  it('should call indexRoute', () => {
    expect(mockIndexRoute).toHaveBeenCalledOnce();
  });

  it('should call createServer', () => {
    expect(mockHttp.createServer).toHaveBeenCalledOnceWith(
      jasmine.any(Function)
    );
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
        writeHead: jasmine.createSpy('writeHead'),
        end: jasmine.createSpy('end'),
        setHeader: jasmine.createSpy('setHeader')
      };

      const handler = mockHttp.createServer.calls.mostRecent().args[0];

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
          redirect: jasmine.any(Function)
        }
      );
    });

    describe('redirecting', () => {
      beforeEach(() => {
        mockViewRouter.go.calls.mostRecent().args[2].redirect('/');
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
        expect(res.end).toHaveBeenCalledOnce();
      });
    });
  });

  describe('closing', () => {
    let spy, fn;

    beforeEach(() => {
      spy = jasmine.createSpy('spy');

      close(spy);

      fn = server.on.calls.argsFor(0)[1];
    });

    it('should register a close event', () => {
      expect(server.on).toHaveBeenCalledOnceWith(
        'close',
        jasmine.any(Function)
      );
    });

    it('should throw if server close throws', () => {
      const fn = server.on.calls.argsFor(0)[1];

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
