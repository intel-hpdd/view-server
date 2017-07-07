import url from 'url';

describe('api-request', () => {
  let mockConf, req, mockGetReq, apiRequest;

  beforeEach(() => {
    mockConf = {
      SERVER_HTTP_URL: url.parse('http://localhost:8000')
    };
    jest.mock('../../../source/conf.js', () => mockConf);

    req = {
      bufferJsonRequest: jest.fn(),
      waitForRequests: {}
    };

    mockGetReq = jest.fn(() => req);
    jest.mock('@iml/req', () => mockGetReq);

    apiRequest = require('../../../source/lib/api-request').default;
  });

  it('should return a function', () => {
    expect(apiRequest).toEqual(expect.any(Function));
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
