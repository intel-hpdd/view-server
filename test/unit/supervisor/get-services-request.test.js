import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect,
  jest
} from '../../jasmine.js';

describe('get services request', () => {
  let getServicesRequest, mockGetReq, req;

  beforeEach(() => {
    req = {
      bufferRequest: jasmine.createSpy('bufferRequest')
    };

    mockGetReq = jasmine.createSpy('getReq').and.returnValue(req);

    jest.mock('@mfl/req', () => mockGetReq);

    getServicesRequest = require('../../../source/supervisor/get-services-request').default;
  });

  it('should create a http req', () => {
    expect(mockGetReq).toHaveBeenCalledOnceWith('http');
  });

  describe('performing request', () => {
    beforeEach(() => {
      getServicesRequest('a:bc');
    });

    it('should call bufferRequest', () => {
      expect(req.bufferRequest).toHaveBeenCalledOnceWith(
        {
          port: 9100,
          method: 'POST',
          path: '/RPC2',
          auth: 'a:bc'
        },
        jasmine.any(Buffer)
      );
    });

    it('should create a buffer with xml content', () => {
      const buff = req.bufferRequest.calls.mostRecent().args[1];
      expect(buff.toString()).toBe(
        '<?xml version="1.0"?>\
<methodCall>\
  <methodName>supervisor.getAllProcessInfo</methodName>\
  <params>\
  </params>\
</methodCall>'
      );
    });
  });

  describe('performing request no auth', () => {
    beforeEach(() => {
      getServicesRequest(null);
    });

    it('should call bufferRequest', () => {
      expect(req.bufferRequest).toHaveBeenCalledOnceWith(
        {
          port: 9100,
          method: 'POST',
          path: '/RPC2'
        },
        jasmine.any(Buffer)
      );
    });
  });
});
