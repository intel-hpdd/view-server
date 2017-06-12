import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect,
  jest
} from '../../jasmine.js';

describe('get uname', () => {
  let getUname, mockChildProcess;

  beforeEach(() => {
    mockChildProcess = {
      exec: jasmine.createSpy('exec').and.callFake((command, cb) => {
        const commands = {
          'uname -m': 'x86_64\n',
          'uname -n': 'iml.local\n',
          'uname -r': '14.1.0\n',
          'uname -s': 'Darwin\n',
          'uname -v':
            'Darwin Kernel Version 14.1.0: Mon Dec 22 23:10:38 PST 2014; \
 root:xnu-2782.10.72~2/RELEASE_X86_64\n'
        };
        cb(null, commands[command]);
      })
    };

    jest.mock('child_process', () => mockChildProcess);

    getUname = require('../../../source/lib/get-uname').default;
  });

  it('should return system information', done => {
    getUname().apply(x => {
      expect(x).toEqual({
        sysname: 'x86_64',
        nodename: 'iml.local',
        release: '14.1.0',
        version: 'Darwin',
        machine:
          'Darwin Kernel Version 14.1.0: Mon Dec 22 23:10:38 PST 2014;  root:xnu-2782.10.72~2/RELEASE_X86_64'
      });

      done();
    });
  });
});
