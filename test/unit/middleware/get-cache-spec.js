'use strict';

var proxyquire = require('proxyquire').noPreserveCache().noCallThru();
var λ = require('highland');
var _ = require('lodash');

describe('get cache', function () {
  var conf, apiRequest, data, req, res, getCache,
    next, calls, renderRequestError, renderRequestErrorInner;

  beforeEach(function () {
    calls = [
      ['/filesystem', {}],
      ['/target', {}],
      ['/host', {}],
      ['/power_control_type', {}],
      ['/server_profile', {}],
      ['/alert', {
        jsonMask: 'objects(affected,message)',
        qs: {
          active: true
        }
      }],
      ['/job', {
        jsonMask: 'objects(write_locks,read_locks,description)',
        qs: {
          state__in: ['pending', 'tasked']
        }
      }]
    ];

    conf = {
      get: jasmine.createSpy('get').and.returnValue(false)
    };

    req = {};
    res = {};

    next = jasmine.createSpy('next');

    data = {
      session: {
        read_enabled: true,
        resource_uri: '/api/session/',
        user: {
          accepted_eula: true,
          alert_subscriptions: [],
          email: 'debug@debug.co.eh',
          eula_state: 'pass',
          first_name: '',
          full_name: '',
          groups: [{
            id: '1',
            name: 'superusers',
            resource_uri: '/api/group/1/'
          }],
          id: '1',
          is_superuser: true,
          last_name: '',
          new_password1: null,
          new_password2: null,
          password1: null,
          password2: null,
          resource_uri: '/api/user/1/',
          username: 'debug'
        }
      },
      cacheCookie: 'csrftoken=0GkwjZHBUq1DoLeg7M3cEfod8d0EjAAn; sessionid=7dbd643025680726843284b5ba7402b1;'
    };

    apiRequest = jasmine.createSpy('apiRequest');

    renderRequestErrorInner = jasmine.createSpy('renderRequestErrorInner');

    renderRequestError = jasmine.createSpy('renderRequestError')
      .and.returnValue(renderRequestErrorInner);

    getCache = proxyquire('../../../middleware/get-cache', {
      '../conf': conf,
      '../lib/api-request': apiRequest,
      '../lib/render-request-error': renderRequestError
    });
  });

  it('should return an empty map if user is null and anonymous read is false', function () {
    data.session.user = null;

    getCache(req, res, data, next);

    var obj = calls.reduce(function (obj, call) {
      obj[call.slice(1)] = [];

      return obj;
    }, {});

    obj.session = data.session;

    data.cache = obj;

    expect(next).toHaveBeenCalledOnceWith(req, res, data);
  });

  describe('successful responses', function () {
    beforeEach(function () {
      apiRequest.and.callFake(function (endpoint) {
        return λ([{
          body: {
            objects: [{
              name: endpoint
            }]
          }
        }]);
      });

      getCache(req, res, data, next);
    });

    it('should request each cache endpoint', function () {
      var fullCalls = calls.map(function (call) {
        return [
          call[0],
          _.merge({
            headers: { Cookie: data.cacheCookie },
            qs: { limit: 0 }
          }, call[1])
        ];
      });

      expect(apiRequest.calls.allArgs()).toEqual(fullCalls);
    });

    it('should return the result of each endpoint', function () {
      var obj = calls.reduce(function (obj, call) {
        obj[call.slice(1)] = [{name: call}];

        return obj;
      }, {});

      obj.session = data.session;

      data.cache = obj;

      expect(next).toHaveBeenCalledOnceWith(req, res, data);
    });
  });

  describe('error response', function () {
    beforeEach(function () {
      apiRequest.and.callFake(function (endpoint) {
        if (endpoint === '/target')
          throw new Error('boom!');
        else
          return λ([{
            body: {
              objects: []
            }
          }]);
      });

      getCache(req, res, data, next);
    });

    it('should push the response to renderRequestError', function () {
      expect(renderRequestError).toHaveBeenCalledOnceWith(res, jasmine.any(Function));
    });

    it('should render an error page on error', function () {
      expect(renderRequestErrorInner).toHaveBeenCalledOnceWith(new Error('boom!'), jasmine.any(Function));
    });
  });
});
