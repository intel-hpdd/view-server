// @flow

//
// Copyright (c) 2018 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import childProcess from 'child_process';
import highland from 'highland';

import type { HighlandStreamT } from 'highland';

const exec: (x: string) => HighlandStreamT<Buffer> = highland.wrapCallback(
  childProcess.exec
);

const services = [
  'iml-corosync.service',
  'iml-gunicorn.service',
  'iml-http-agent.service',
  'iml-job-scheduler.service',
  'iml-lustre-audit.service',
  'iml-manager.target',
  'iml-plugin-runner.service',
  'iml-power-control.service',
  'iml-realtime.service',
  'iml-stats.service',
  'iml-syslog.service',
  'iml-view-server.service'
];

export default (): HighlandStreamT<string> =>
  highland(services)
    .flatMap(x => exec(`systemctl is-active ${x}`))
    .map(x => x.toString())
    .filter(() => false)
    .errors((err: any, push) => {
      if (err.cmd) push(null, err.cmd);
      else push(null, 'systemctl is-active');
    });
