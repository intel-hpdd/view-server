'use strict';

var proxyquire = require('proxyquire').noPreserveCache().noCallThru();
var url = require('url');
var _ = require('@intel-js/lodash-mixins');

describe('api-request', function () {

  var conf, getReq, req, apiRequest;
  beforeEach(function () {

    conf = {
      get: jasmine.createSpy('get').and.returnValue(url.parse('http://localhost:8000'))
    };

    req = {
      bufferRequest: jasmine.createSpy('bufferRequest'),
      waitForRequests: {}
    };

    getReq = jasmine.createSpy('getReq').and.returnValue(req);

    apiRequest = proxyquire('../../../lib/api-request', {
      '../conf': conf,
      'url': url,
      '@intel-js/req': getReq
    })();
  });

  it('should return a function', function () {
    expect(apiRequest).toEqual(jasmine.any(Function));
  });

  describe('with given path and options', function () {
    var path, options, hostOptions;
    beforeEach(function () {
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

    it('should invoke the bufferReqeust with the api formatted path and options', function () {
      expect(req.bufferRequest).toHaveBeenCalledWith(_.merge({
        path: '/api/session/'
      }, options, hostOptions));
    });
  });
});
