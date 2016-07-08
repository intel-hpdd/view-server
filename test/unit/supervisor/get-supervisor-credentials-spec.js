'use strict';

var proxyquire = require('proxyquire').noPreserveCache().noCallThru();
var crypto = require('crypto');

describe('get supervisor credentials', function () {
  var getSupervisorCredentials, childProcess, conf, callback;

  beforeEach(function () {
    childProcess = {
      exec: jasmine.createSpy('exec').and.callFake(function (cmd, opts, cb) {
        callback = cb;
      })
    };

    conf = {
      NODE_ENV: 'development'
    };

    spyOn(crypto, 'createHash').and.callThrough();

    getSupervisorCredentials = proxyquire('../../../supervisor/get-supervisor-credentials', {
      child_process: childProcess,
      '../conf': conf,
      crypto: crypto
    });
  });

  it('should return supervisor credentials', function (done) {
    getSupervisorCredentials()
      .apply(function (x) {
        expect(x).toEqual('cacfb6f:07c5ccc275c888efe5681023dc54e108');
        done();
      });

    callback(null, '(rpb*-5f69cv=zc#$-bed7^_&8f)ve4dt4chace$r^89)+%2i*');
  });

  it('should return null if we are in production', function (done) {
    conf.NODE_ENV = 'production';

    getSupervisorCredentials()
      .apply(function (x) {
        expect(x).toEqual(null);
        done();
      });
  });

  it('should cache credentials', function (done) {
    getSupervisorCredentials()
      .flatMap(getSupervisorCredentials)
      .apply(function () {
        expect(crypto.createHash).toHaveBeenCalledTwice();
        done();
      });

    callback(null, '(rpb*-5f68cv=zc#$-bed7^_&8f)ve4dt4chace$r^89)+%2i*');
  });
});
