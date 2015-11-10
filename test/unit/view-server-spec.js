'use strict';

var proxyquire = require('proxyquire').noPreserveCache().noCallThru();


describe('view server', function () {
  var http, https, close, server, loginRoute, indexRoute, viewRouter, conf, api;

  beforeEach(function () {
    server = {
      listen: jasmine.createSpy('listen').and.callFake(function s () {
        return server;
      }),
      on: jasmine.createSpy('on')
    };

    http = {
      createServer: jasmine.createSpy('createServer').and.returnValue(server),
      globalAgent: {
        maxSockets: {}
      }
    };

    https = {
      globalAgent: {
        maxSockets: {}
      }
    };

    viewRouter = {
      go: jasmine.createSpy('go')
    };

    conf = {
      get: jasmine.createSpy('get').and.returnValue(8900)
    };

    loginRoute = jasmine.createSpy('loginRoute');
    indexRoute = jasmine.createSpy('indexRoute');

    api = {
      waitForRequests: jasmine.createSpy('waitForRequests')
    };

    close = proxyquire('../../view-server', {
      'http': http,
      'https': https,
      './routes/login-route': loginRoute,
      './routes/index-route': indexRoute,
      './view-router': viewRouter,
      './lib/api-request': api,
      './conf': conf
    })();
  });

  it('should return a close function', function () {
    expect(close).toEqual(jasmine.any(Function));
  });

  it('should call loginRoute', function () {
    expect(loginRoute).toHaveBeenCalledOnce();
  });

  it('should call indexRoute', function () {
    expect(indexRoute).toHaveBeenCalledOnce();
  });

  it('should call createServer', function () {
    expect(http.createServer).toHaveBeenCalledOnceWith(jasmine.any(Function));
  });

  it('should listen on the view server port', function () {
    expect(server.listen).toHaveBeenCalledOnceWith(8900);
  });

  describe('routing requests', function () {
    var req, res;

    beforeEach(function () {
      req = {
        url: '/foo/bar',
        method: 'get'
      };

      res = {
        writeHead: jasmine.createSpy('writeHead'),
        end: jasmine.createSpy('end')
      };

      var handler = http.createServer.calls.mostRecent().args[0];

      handler(req, res);
    });

    it('should call the view router', function () {
      expect(viewRouter.go).toHaveBeenCalledOnceWith(req.url,
        {
          verb: req.method,
          clientReq: req
        },
        {
          clientRes: res,
          redirect: jasmine.any(Function)
        });
    });

    describe('redirecting', function () {
      beforeEach(function () {
        viewRouter.go.calls.mostRecent().args[2].redirect('/');
      });

      it('should have a method to redirect on the response object', function () {
        expect(res.writeHead).toHaveBeenCalledOnceWith(302, { Location: '/' });
      });

      it('should end the response', function () {
        expect(res.end).toHaveBeenCalledOnce();
      });
    });
  });

  describe('closing', function () {
    var spy, fn;

    beforeEach(function () {
      spy = jasmine.createSpy('spy');

      close(spy);

      fn = server.on.calls.argsFor(0)[1];
    });

    it('should register a close event', function () {
      expect(server.on).toHaveBeenCalledOnceWith('close', jasmine.any(Function));
    });

    it('should throw if server close throws', function () {
      var fn = server.on.calls.argsFor(0)[1];

      expect(expectToThrow).toThrow(new Error('boom!'));

      function expectToThrow () {
        fn(new Error('boom!'));
      }
    });

    it('should wait for api requests', function () {
      fn();
      expect(api.waitForRequests).toHaveBeenCalledOnceWith(spy);
    });
  });
});
