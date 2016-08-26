import * as fp from 'intel-fp';
import proxyquire from '../../proxyquire.js';

import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect
} from '../../jasmine.js';


describe('index handlers', () => {
  let indexHandlers,
    templates,
    conf,
    req,
    res,
    data,
    next;

  beforeEach(() => {
    req = {};

    res = {
      clientRes: {
        setHeader: jasmine.createSpy('setHeader'),
        end: jasmine.createSpy('end')
      },
      redirect: jasmine.createSpy('redirect')
    };

    data = {
      cache: {
        session: {
          user: {}
        }
      }
    };

    next = jasmine.createSpy('next');

    templates = {
      'new/index.html': jasmine.createSpy('index').and.returnValue('index'),
      'base.html': jasmine.createSpy('base').and.returnValue('base')
    };

    conf = {
      get: fp.always(false)
    };

    indexHandlers = proxyquire('../source/lib/index-handlers', {
      './templates.js': templates,
      '../conf.js': conf
    }).default;
  });

  it('should redirect if we don\'t have a user and disallow anonymous read', () => {
    delete data.cache.session.user;

    indexHandlers.newHandler(req, res, data, next);

    expect(res.redirect).toHaveBeenCalledOnceWith('/ui/login/');
  });

  it('should set the response header', () => {
    indexHandlers.newHandler(req, res, data, next);

    expect(res.clientRes.setHeader).toHaveBeenCalledOnceWith('Content-Type', 'text/html; charset=utf-8');
  });

  it('should set the status code', () => {
    indexHandlers.newHandler(req, res, data, next);

    expect(res.clientRes.statusCode).toBe(200);
  });

  it('should render the template', () => {
    indexHandlers.newHandler(req, res, data, next);

    expect(templates['new/index.html']).toHaveBeenCalledOnceWith({
      title: '',
      cache: data.cache
    });
  });

  it('should render the old template', () => {
    indexHandlers.oldHandler(req, res, data, next);

    expect(templates['base.html']).toHaveBeenCalledOnceWith({
      title: '',
      cache: data.cache
    });
  });

  it('should end the response', () => {
    indexHandlers.newHandler(req, res, data, next);

    expect(res.clientRes.end).toHaveBeenCalledOnceWith('index');
  });

  it('should call next', () => {
    indexHandlers.newHandler(req, res, data, next);

    expect(next).toHaveBeenCalledOnceWith(req, res);
  });
});
