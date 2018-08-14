import * as obj from '@iml/obj';
import highland from 'highland';

describe('get cache', () => {
  let mockConf, mockApiRequest, data, req, res, getCache, next, calls, mockRenderRequestError, renderRequestErrorInner;

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
      get: jest.fn(() => false)
    };
    jest.mock('../../../source/conf.js', () => mockConf);

    req = {};
    res = {};

    next = jest.fn();

    data = {
      session: {
        read_enabled: true,
        resource_uri: '/api/session/',
        user: {
          alert_subscriptions: [],
          email: 'debug@debug.co.eh',
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
      cacheCookie: 'csrftoken=0GkwjZHBUq1DoLeg7M3cEfod8d0EjAAn; sessionid=7dbd643025680726843284b5ba7402b1;'
    };

    mockApiRequest = jest.fn();
    jest.mock('../../../source/lib/api-request.js', () => mockApiRequest);

    renderRequestErrorInner = jest.fn();

    mockRenderRequestError = jest.fn(() => renderRequestErrorInner);

    jest.mock('../../../source/lib/render-request-error.js', () => mockRenderRequestError);

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
      mockApiRequest.mockImplementation(endpoint => {
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

      expect(mockApiRequest.mock.calls).toEqual(fullCalls);
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
      mockApiRequest.mockImplementation(opts => {
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
      expect(mockRenderRequestError).toHaveBeenCalledOnceWith(res, expect.any(Function));
    });

    it('should render an error page on error', () => {
      expect(renderRequestErrorInner).toHaveBeenCalledOnceWith(new Error('boom!'), expect.any(Function));
    });
  });
});
