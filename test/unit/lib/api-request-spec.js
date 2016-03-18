'use strict';

var proxyquire = require('proxyquire').noPreserveCache().noCallThru();
var url = require('url');
var _ = require('lodash');

describe('api-request', function () {
  var conf, req, getReq, apiRequest;

  beforeEach(function () {
    conf = {
      get: jasmine.createSpy('get').and.returnValue(url.parse('http://localhost:8000'))
    };

    req = {
      bufferJsonRequest: jasmine.createSpy('bufferRequest'),
      waitForRequests: {}
    };

    getReq = jasmine.createSpy('getReq').and.returnValue(req);

    apiRequest = proxyquire('../../../lib/api-request', {
      '../conf': conf,
      'url': url,
      'intel-req': getReq
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

    it('should call getReq', function () {
      expect(getReq).toHaveBeenCalledOnceWith('https');
    });

    it('should invoke the bufferReqeust with the api formatted path and options', function () {
      expect(req.bufferJsonRequest).toHaveBeenCalledWith(_.merge({
        path: '/api/session/'
      }, options, hostOptions));
    });
  });
});
