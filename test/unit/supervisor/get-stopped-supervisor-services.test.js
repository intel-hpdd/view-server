import { PassThrough } from 'stream';

describe('get stopped supervisor services', () => {
  let getStoppedSupervisorServices, mockNet, stream;

  beforeEach(() => {
    stream = new PassThrough();

    mockNet = {
      connect: jest.fn(() => stream)
    };
    jest.mock('net', () => mockNet);

    getStoppedSupervisorServices = require('../../../source/supervisor/get-stopped-supervisor-services').default;
  });

  it('should return the non-running services', done => {
    stream.end(
      JSON.stringify({
        result: [
          {
            statename: 'RUNNING',
            name: 'realtime'
          },
          {
            statename: 'STOPPED',
            name: 'corosync'
          }
        ]
      })
    );

    getStoppedSupervisorServices()
      .errors(done.fail)
      .apply(x => {
        expect(x).toBe('corosync');

        done();
      });
  });

  it('should return empty when everything is running', done => {
    stream.end(
      JSON.stringify({
        result: [
          {
            statename: 'RUNNING',
            name: 'realtime'
          },
          {
            statename: 'RUNNING',
            name: 'corosync'
          }
        ]
      })
    );

    getStoppedSupervisorServices()
      .errors(done.fail)
      .apply(x => {
        expect(x).toBe(undefined);

        done();
      });
  });

  it('should tell supervisor is down on error', done => {
    stream.emit(new Error('socket error'));
    stream.end();

    getStoppedSupervisorServices()
      .errors(done.fail)
      .apply(x => {
        expect(x).toBe('supervisor');

        done();
      });
  });
});
