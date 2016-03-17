'use strict';

var proxyquire = require('proxyquire').noPreserveCache().noCallThru();


describe('get services request', function () {
  var getServicesRequest, getReq, req;

  beforeEach(function () {
    req = {
      bufferRequest: jasmine.createSpy('bufferRequest')
    };

    getReq = jasmine.createSpy('getReq').and.returnValue(req);

    getServicesRequest = proxyquire('../../../supervisor/get-services-request', {
      'intel-req': getReq
    });
  });

  it('should create a http req', function () {
    expect(getReq).toHaveBeenCalledOnceWith('http');
  });

  describe('performing request', function () {
    beforeEach(function () {
      getServicesRequest('a:bc');
    });

    it('should call bufferRequest', function () {
      expect(req.bufferRequest).toHaveBeenCalledOnceWith(
        {
          port: 9100,
          method: 'POST',
          path: '/RPC2',
          auth: 'a:bc'
        },
        new Buffer('<?xml version="1.0"?>\
<methodCall>\
  <methodName>supervisor.getAllProcessInfo</methodName>\
  <params>\
  </params>\
</methodCall>')
      );
    });
  });

  describe('performing request no auth', function () {
    beforeEach(function () {
      getServicesRequest(null);
    });

    it('should call bufferRequest', function () {
      expect(req.bufferRequest).toHaveBeenCalledOnceWith(
        {
          port: 9100,
          method: 'POST',
          path: '/RPC2'
        },
        new Buffer('<?xml version="1.0"?>\
<methodCall>\
  <methodName>supervisor.getAllProcessInfo</methodName>\
  <params>\
  </params>\
</methodCall>')
      );
    });
  });
});
