import highland from 'highland';

describe('check for problems', () => {
  let checkForProblems,
    req,
    res,
    next,
    mockRenderRequestError,
    mockGetStoppedSystemdServices,
    push;

  beforeEach(() => {
    mockGetStoppedSystemdServices = jest.fn(() =>
      highland(_push_ => {
        push = _push_;
      })
    );
    jest.mock(
      '../../../source/systemd/get-stopped-systemd-services.js',
      () => mockGetStoppedSystemdServices
    );

    mockRenderRequestError = jest.fn(() => () => {});
    jest.mock(
      '../../../source/lib/render-request-error.js',
      () => mockRenderRequestError
    );

    req = {
      matches: ['/foo/bar']
    };
    res = {};

    next = jest.fn();

    checkForProblems = require('../../../source/middleware/check-for-problems')
      .default;

    checkForProblems(req, res, next);
  });

  it('should report what services are down', () => {
    push(null, 'corosync');
    push(null, 'autoreload');
    push(null, highland.nil);

    const message = mockRenderRequestError.mock.calls[0][1]();

    expect(message).toBe(
      'The following services are not running: \n\ncorosync\nautoreload\n\n'
    );
  });

  it('should call next if no services are down', () => {
    push(null, highland.nil);

    expect(next).toHaveBeenCalledOnceWith(req, res);
  });
});
