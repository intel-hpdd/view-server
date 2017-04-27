import highland from 'highland';
import proxyquire from '../../proxyquire.js';

import { describe, beforeEach, it, jasmine, expect } from '../../jasmine.js';

describe('get session', () => {
  let getSession,
    apiRequest,
    renderRequestError,
    renderRequestErrorInner,
    req,
    res,
    next,
    push;

  beforeEach(() => {
    req = {
      clientReq: {
        headers: {
          cookie: 'foo'
        }
      }
    };

    res = {
      clientRes: {
        setHeader: jasmine.createSpy('setHeader')
      }
    };

    next = jasmine.createSpy('next');

    apiRequest = jasmine.createSpy('apiRequest').and.returnValue(
      highland(_push_ => {
        push = (err, val) => {
          _push_(err, val);
          _push_(null, highland.nil);
        };
      })
    );

    renderRequestErrorInner = jasmine.createSpy('renderRequestErrorInner');

    renderRequestError = jasmine
      .createSpy('renderRequestError')
      .and.returnValue(renderRequestErrorInner);

    getSession = proxyquire('../source/middleware/get-session', {
      '../lib/api-request.js': apiRequest,
      '../lib/render-request-error.js': renderRequestError
    }).default;

    getSession(req, res, next);
  });

  it('should get a session', () => {
    expect(apiRequest).toHaveBeenCalledOnceWith('/session', {
      headers: {
        cookie: 'foo'
      }
    });
  });

  it('should pass session data to the next function', () => {
    push(null, {
      headers: {
        'set-cookie': [
          'csrftoken=0GkwjZHBUq1DoLeg7M3cEfod8d0EjAAn; expires=Mon, 08-Feb-2016 17:12:32 GMT; Max-Age=31449600; Path=/',
          'sessionid=7dbd643025680726843284b5ba7402b1; expires=Mon, 23-Feb-2015 17:12:32 GMT; Max-Age=1209600; Path=/'
        ]
      },
      body: { session: 'stuff' }
    });

    expect(next).toHaveBeenCalledOnceWith(req, res, {
      session: {
        session: 'stuff'
      },
      cache: {},
      cacheCookie: 'csrftoken=0GkwjZHBUq1DoLeg7M3cEfod8d0EjAAn; sessionid=7dbd643025680726843284b5ba7402b1;'
    });
  });

  it('should stop on error', () => {
    push(new Error('boom!'));

    expect(renderRequestErrorInner).toHaveBeenCalledOnceWith(
      new Error('boom!'),
      jasmine.any(Function)
    );
  });
});
