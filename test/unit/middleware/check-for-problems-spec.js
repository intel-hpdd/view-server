'use strict';

var proxyquire = require('proxyquire').noPreserveCache().noCallThru();
var λ = require('highland');

describe('check for problems', function () {
  var checkForProblems, req, res, next, logger, renderRequestError,
    getStoppedSupervisorServices, push;

  beforeEach(function () {
    logger = {
      child: jasmine.createSpy('child').and.returnValue({
        error: jasmine.createSpy('error')
      })
    };

    getStoppedSupervisorServices = jasmine.createSpy('getStoppedSupervisorServices')
      .and.returnValue(λ(function (_push_) {
        push = _push_;
      }));

    renderRequestError = jasmine.createSpy('renderRequestError');

    req = { matches: ['/foo/bar'] };
    res = {};

    next = jasmine.createSpy('next');

    checkForProblems = proxyquire('../../../middleware/check-for-problems', {
      '../logger': logger,
      '../lib/get-stopped-supervisor-services': getStoppedSupervisorServices,
      '../lib/render-request-error': renderRequestError
    });

    checkForProblems(req, res, next);
  });

  it('should tell supervisor is down on error', function () {
    push(new Error('socket error'));
    push(null, nil);

    expect(renderRequestError)
      .toHaveBeenCalledOnceWith(res, 'The following services are not running: \n\nsupervisor\n\n', null);
  });

  it('should report what services are down', function () {
    push(null, 'corosync');
    push(null, 'autoreload');
    push(null, nil);

    expect(renderRequestError)
      .toHaveBeenCalledOnceWith(res, 'The following services are not running: \n\ncorosync\nautoreload\n\n', null);
  });

  it('should call next if no services are down', function () {
    push(null, nil);

    expect(next).toHaveBeenCalledOnceWith(req, res);
  });
});
