describe('get stopped systemd services', () => {
  let getStoppedSystemdServices, mockChildProcess;

  beforeEach(() => {
    mockChildProcess = {
      exec: jest.fn((_, cb) => {
        cb(
          null,
          `iml-corosync.service                                                                                           loaded    active   running   IML Corosync Service
iml-gunicorn.service                                                                                           loaded    inactive dead      IML Manager Service
iml-http-agent.service                                                                                         loaded    active   running   IML Http Agent Service
iml-job-scheduler.service                                                                                      loaded    active   running   IML Job Scheduler Service
iml-lustre-audit.service                                                                                       loaded    active   running   IML Lustre Audit Service
iml-plugin-runner.service                                                                                      loaded    active   running   IML Plugin Runner Service
iml-power-control.service                                                                                      loaded    active   running   IML Power Control Service Service
iml-srcmap-reverse.service                                                                                     loaded    inactive dead      Source Map Reverse Service
iml-stats.service                                                                                              loaded    active   running   IML Stats Service
iml-supervisor-status.service                                                                                  loaded    inactive dead      IML Supervisor Status Service
iml-syslog.service                                                                                             loaded    active   running   IML Syslog Service
`
        );
      })
    };

    jest.mock('child_process', () => mockChildProcess);

    getStoppedSystemdServices = require('../../../source/systemd/get-stopped-systemd-services')
      .default;
  });

  it('should return the inactive services', done => {
    getStoppedSystemdServices()
      .collect()
      .each(xs => {
        expect(xs).toEqual([
          'iml-gunicorn.service',
          'iml-srcmap-reverse.service',
          'iml-supervisor-status.service'
        ]);

        done();
      });
  });
});
