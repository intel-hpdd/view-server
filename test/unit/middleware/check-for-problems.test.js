import highland from 'highland';

import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect,
  jest
} from '../../jasmine.js';

describe('check for problems', () => {
  let checkForProblems,
    req,
    res,
    next,
    mockRenderRequestError,
    mockGetStoppedSupervisorServices,
    push;

  beforeEach(() => {
    mockGetStoppedSupervisorServices = jasmine
      .createSpy('getStoppedSupervisorServices')
      .and.returnValue(
        highland(_push_ => {
          push = _push_;
        })
      );
    jest.mock(
      '../source/supervisor/get-stopped-supervisor-services.js',
      () => mockGetStoppedSupervisorServices
    );

    mockRenderRequestError = jasmine
      .createSpy('renderRequestError')
      .and.returnValue(() => {});
    jest.mock(
      '../source/lib/render-request-error.js',
      () => mockRenderRequestError
    );

    req = {
      matches: ['/foo/bar']
    };
    res = {};

    next = jasmine.createSpy('next');

    checkForProblems = require('../../../source/middleware/check-for-problems')
      .default;

    checkForProblems(req, res, next);
  });

  it('should report what services are down', () => {
    push(null, 'corosync');
    push(null, 'autoreload');
    push(null, highland.nil);

    const message = mockRenderRequestError.calls.mostRecent().args[1]();

    expect(message).toBe(
      'The following services are not running: \n\ncorosync\nautoreload\n\n'
    );
  });

  it('should call next if no services are down', () => {
    push(null, highland.nil);

    expect(next).toHaveBeenCalledOnceWith(req, res);
  });
});
