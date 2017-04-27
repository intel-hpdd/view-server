import proxyquire from '../../proxyquire.js';
import url from 'url';

import { describe, beforeEach, it, jasmine, expect } from '../../jasmine.js';

describe('api-request', () => {
  let conf, req, getReq, apiRequest;

  beforeEach(() => {
    conf = {
      SERVER_HTTP_URL: url.parse('http://localhost:8000')
    };

    req = {
      bufferJsonRequest: jasmine.createSpy('bufferRequest'),
      waitForRequests: {}
    };

    getReq = jasmine.createSpy('getReq').and.returnValue(req);

    apiRequest = proxyquire('../source/lib/api-request', {
      '../conf.js': conf,
      url: url,
      '@mfl/req': getReq
    }).default;
  });

  it('should return a function', () => {
    expect(apiRequest).toEqual(jasmine.any(Function));
  });

  describe('with given path and options', () => {
    let path, options, hostOptions;

    beforeEach(() => {
      path = '/session';
      options = {
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

      apiRequest(path, options);
    });

    it('should call getReq', () => {
      expect(getReq).toHaveBeenCalledOnceWith('https');
    });

    it('should invoke the bufferReqeust with the api formatted path and options', () => {
      expect(req.bufferJsonRequest).toHaveBeenCalledWith({
        path: '/api/session/',
        ...options,
        ...hostOptions
      });
    });
  });
});
