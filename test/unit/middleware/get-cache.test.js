import * as obj from '@mfl/obj';
import highland from 'highland';

import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect,
  jest
} from '../../jasmine.js';

describe('get cache', () => {
  let mockConf,
    mockApiRequest,
    data,
    req,
    res,
    getCache,
    next,
    calls,
    mockRenderRequestError,
    renderRequestErrorInner;

  beforeEach(() => {
    calls = [
      ['/filesystem', {}],
      ['/target', {}],
      ['/host', {}],
      ['/power_control_type', {}],
      ['/server_profile', {}],
      [
        '/lnet_configuration',
        {
          qs: {
            dehydrate__host: false
          }
        }
      ],
      [
        '/alert',
        {
          jsonMask: 'objects(affected,message)',
          qs: {
            active: true
          }
        }
      ],
      [
        '/job',
        {
          jsonMask: 'objects(write_locks,read_locks,description)',
          qs: {
            state__in: ['pending', 'tasked']
          }
        }
      ]
    ];

    mockConf = {
      get: jasmine.createSpy('get').and.returnValue(false)
    };
    jest.mock('../source/conf.js', () => mockConf);

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
          groups: [
            {
              id: '1',
              name: 'superusers',
              resource_uri: '/api/group/1/'
            }
          ],
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
      cacheCookie:
        'csrftoken=0GkwjZHBUq1DoLeg7M3cEfod8d0EjAAn; sessionid=7dbd643025680726843284b5ba7402b1;'
    };

    mockApiRequest = jasmine.createSpy('apiRequest');
    jest.mock('../source/lib/api-request.js', () => mockApiRequest);

    renderRequestErrorInner = jasmine.createSpy('renderRequestErrorInner');

    mockRenderRequestError = jasmine
      .createSpy('renderRequestError')
      .and.returnValue(renderRequestErrorInner);
    jest.mock(
      '../source/lib/render-request-error.js',
      () => mockRenderRequestError
    );

    getCache = require('../../../source/middleware/get-cache').default;
  });

  it('should return an empty map if user is null and anonymous read is false', () => {
    data.session.user = null;

    getCache(req, res, data, next);

    const obj = calls.reduce((obj, call) => {
      obj[call.slice(1)] = [];

      return obj;
    }, {});

    obj.session = data.session;

    data.cache = obj;

    expect(next).toHaveBeenCalledOnceWith(req, res, data);
  });

  describe('successful responses', () => {
    beforeEach(() => {
      mockApiRequest.and.callFake(endpoint => {
        return highland([
          {
            body: {
              objects: [
                {
                  name: endpoint
                }
              ]
            }
          }
        ]);
      });

      getCache(req, res, data, next);
    });

    it('should request each cache endpoint', () => {
      const fullCalls = calls.map(call => {
        return [
          obj.merge(
            {
              path: call[0],
              headers: {
                Cookie: data.cacheCookie
              },
              qs: {
                limit: 0
              }
            },
            call[1]
          )
        ];
      });

      expect(mockApiRequest.calls.allArgs()).toEqual(fullCalls);
    });

    it('should return the result of each endpoint', () => {
      const obj = calls.reduce((obj, call) => {
        obj[call.slice(1)] = [{ name: call }];

        return obj;
      }, {});

      obj.session = data.session;

      data.cache = obj;

      expect(next).toHaveBeenCalledOnceWith(req, res, data);
    });
  });

  describe('error response', () => {
    beforeEach(() => {
      mockApiRequest.and.callFake(opts => {
        if (opts.path === '/target') throw new Error('boom!');
        else
          return highland([
            {
              body: {
                objects: []
              }
            }
          ]);
      });

      getCache(req, res, data, next);
    });

    it('should push the response to renderRequestError', () => {
      expect(mockRenderRequestError).toHaveBeenCalledOnceWith(
        res,
        jasmine.any(Function)
      );
    });

    it('should render an error page on error', () => {
      expect(renderRequestErrorInner).toHaveBeenCalledOnceWith(
        new Error('boom!'),
        jasmine.any(Function)
      );
    });
  });
});
