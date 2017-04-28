import url from 'url';

import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect,
  jest
} from '../../jasmine.js';

describe('api-request', () => {
  let mockConf, req, mockGetReq, apiRequest;

  beforeEach(() => {
    mockConf = {
      SERVER_HTTP_URL: url.parse('http://localhost:8000')
    };
    jest.mock('../source/conf.js', () => mockConf);

    req = {
      bufferJsonRequest: jasmine.createSpy('bufferRequest'),
      waitForRequests: {}
    };

    mockGetReq = jasmine.createSpy('getReq').and.returnValue(req);
    jest.mock('@mfl/req', () => mockGetReq);

    apiRequest = require('../../../source/lib/api-request').default;
  });

  it('should return a function', () => {
    expect(apiRequest).toEqual(jasmine.any(Function));
  });

  describe('with given path and options', () => {
    let options, hostOptions;

    beforeEach(() => {
      options = {
        path: '/session',
        headers: {
          cookie: {}
        }
      };
      hostOptions = {
        localhost: 'http://localhost:8000/',
        host: 'localhost:8000',
        hostname: 'localhost',
        port: '8000'
      };

      apiRequest(options);
    });

    it('should call getReq', () => {
      expect(mockGetReq).toHaveBeenCalledOnceWith('https');
    });

    it('should invoke the bufferReqeust with the api formatted path and options', () => {
      expect(req.bufferJsonRequest).toHaveBeenCalledWith({
        ...options,
        ...hostOptions,
        path: '/api/session/'
      });
    });
  });
});
