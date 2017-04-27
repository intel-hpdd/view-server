import highland from 'highland';
import proxyquire from '../../proxyquire.js';

import { describe, beforeEach, it, jasmine, expect } from '../../jasmine.js';

describe('check for problems', () => {
  let checkForProblems,
    req,
    res,
    next,
    logger,
    renderRequestError,
    getStoppedSupervisorServices,
    push;

  beforeEach(() => {
    logger = {
      child: jasmine.createSpy('child').and.returnValue({
        error: jasmine.createSpy('error')
      })
    };

    getStoppedSupervisorServices = jasmine
      .createSpy('getStoppedSupervisorServices')
      .and.returnValue(
        highland(_push_ => {
          push = _push_;
        })
      );

    renderRequestError = jasmine.createSpy('renderRequestError');

    req = {
      matches: ['/foo/bar']
    };
    res = {};

    next = jasmine.createSpy('next');

    checkForProblems = proxyquire('../source/middleware/check-for-problems', {
      '../logger.js': logger,
      '../supervisor/get-stopped-supervisor-services.js': getStoppedSupervisorServices,
      '../lib/render-request-error.js': renderRequestError
    }).default;

    checkForProblems(req, res, next);
  });

  it('should tell supervisor is down on error', () => {
    push(new Error('socket error'));
    push(null, highland.nil);

    const message = renderRequestError.calls.mostRecent().args[1]();

    expect(message).toBe(
      'The following services are not running: \n\nsupervisor\n\n'
    );
  });

  it('should report what services are down', () => {
    push(null, 'corosync');
    push(null, 'autoreload');
    push(null, highland.nil);

    const message = renderRequestError.calls.mostRecent().args[1]();

    expect(message).toBe(
      'The following services are not running: \n\ncorosync\nautoreload\n\n'
    );
  });

  it('should call next if no services are down', () => {
    push(null, highland.nil);

    expect(next).toHaveBeenCalledOnceWith(req, res);
  });
});
