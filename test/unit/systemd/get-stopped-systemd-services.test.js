describe('get stopped systemd services', () => {
  let getStoppedSystemdServices, mockChildProcess;

  beforeEach(() => {
    mockChildProcess = {
      exec: jest.fn((cmd, cb) => {
        const commands = {
          'systemctl is-active iml-corosync.service': [null, 'active'],
          'systemctl is-active iml-gunicorn.service': [
            { cmd: 'systemctl is-active iml-gunicorn.service' },
            'active'
          ],
          'systemctl is-active iml-http-agent.service': [null, 'active'],
          'systemctl is-active iml-job-scheduler.service': [null, 'active'],
          'systemctl is-active iml-lustre-audit.service': [null, 'active'],
          'systemctl is-active iml-manager.target': [null, 'active'],
          'systemctl is-active iml-plugin-runner.service': [null, 'active'],
          'systemctl is-active iml-power-control.service': [null, 'active'],
          'systemctl is-active iml-realtime.service': [
            { cmd: 'systemctl is-active iml-realtime.service' },
            'failed'
          ],
          'systemctl is-active iml-stats.service': [null, 'active'],
          'systemctl is-active iml-syslog.service': [null, 'active'],
          'systemctl is-active iml-view-server.service': [null, 'active']
        };

        cb(...commands[cmd]);
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
          'systemctl is-active iml-gunicorn.service',
          'systemctl is-active iml-realtime.service'
        ]);

        done();
      });
  });
});
