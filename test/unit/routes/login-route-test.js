import highland from 'highland';
import proxyquire from '../../proxyquire.js';

import { describe, beforeEach, it, jasmine, expect } from '../../jasmine.js';

describe('login route', () => {
  let viewRouter,
    templates,
    req,
    res,
    next,
    push,
    apiRequest,
    pathRouter,
    renderRequestError,
    renderRequestErrorInner;

  beforeEach(() => {
    req = {};

    res = {
      redirect: jasmine.createSpy('redirect'),
      clientRes: {
        setHeader: jasmine.createSpy('setHeader'),
        end: jasmine.createSpy('end')
      }
    };

    next = jasmine.createSpy('next');

    templates = {
      'index.html': jasmine.createSpy('indexTemplate').and.returnValue('foo')
    };

    pathRouter = {
      get: jasmine.createSpy('get').and.callFake(() => {
        return pathRouter;
      })
    };

    viewRouter = {
      route: jasmine.createSpy('route').and.returnValue(pathRouter)
    };

    apiRequest = jasmine.createSpy('apiRequest').and.returnValue(
      highland(_push_ => {
        push = _push_;
      })
    );

    renderRequestErrorInner = jasmine.createSpy('renderRequestErrorInner');

    renderRequestError = jasmine
      .createSpy('renderRequestError')
      .and.returnValue(renderRequestErrorInner);

    proxyquire('../source/routes/login-route', {
      '../view-router.js': viewRouter,
      '../lib/templates.js': templates,
      '../lib/api-request.js': apiRequest,
      '../lib/render-request-error.js': renderRequestError
    }).default();
  });

  it('should register a path for the login route', () => {
    expect(viewRouter.route).toHaveBeenCalledOnceWith('/ui/login');
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

      handler = pathRouter.get.calls.first().args[0];
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
        expect(apiRequest).toHaveBeenCalledOnceWith('/session', {
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
          jasmine.any(Function)
        );
      });
    });
  });

  describe('render login', () => {
    beforeEach(() => {
      const handler = pathRouter.get.calls.mostRecent().args[0];
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
      expect(templates['index.html']).toHaveBeenCalledOnceWith({
        title: 'Login',
        cache: {}
      });
    });

    it('should call next', () => {
      expect(next).toHaveBeenCalledOnceWith(req, res);
    });
  });
});
