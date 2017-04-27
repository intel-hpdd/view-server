import crypto from 'crypto';

import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect,
  spyOn,
  jest
} from '../../jasmine.js';

describe('get supervisor credentials', () => {
  let getSupervisorCredentials, mockChildProcess, mockConf, callback;

  beforeEach(() => {
    mockChildProcess = {
      exec: jasmine.createSpy('exec').and.callFake((cmd, opts, cb) => {
        callback = cb;
      })
    };
    jest.mock('child_process', () => mockChildProcess);

    mockConf = {
      NODE_ENV: 'development'
    };
    jest.mock('../source/conf.js', () => mockConf);

    spyOn(crypto, 'createHash').and.callThrough();

    getSupervisorCredentials = require('../../../source/supervisor/get-supervisor-credentials.js').default;
  });

  it('should return supervisor credentials', done => {
    getSupervisorCredentials().apply(x => {
      expect(x).toEqual('cacfb6f:07c5ccc275c888efe5681023dc54e108');
      done();
    });

    callback(null, '(rpb*-5f69cv=zc#$-bed7^_&8f)ve4dt4chace$r^89)+%2i*');
  });

  it('should return null if we are in production', done => {
    mockConf.NODE_ENV = 'production';

    getSupervisorCredentials().apply(x => {
      expect(x).toEqual(null);
      done();
    });
  });

  it('should cache credentials', done => {
    getSupervisorCredentials().flatMap(getSupervisorCredentials).apply(() => {
      expect(crypto.createHash).toHaveBeenCalledTwice();
      done();
    });

    callback(null, '(rpb*-5f68cv=zc#$-bed7^_&8f)ve4dt4chace$r^89)+%2i*');
  });
});
