// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import xml2Json from '@mfl/xml-2-json';
import getSupervisorCredentials from './get-supervisor-credentials.js';
import getServicesRequest from './get-services-request.js';
import readResponse from './read-response.js';

import type { HighlandStreamT } from 'highland';

export default (): HighlandStreamT<string> =>
  getSupervisorCredentials()
    .flatMap(getServicesRequest)
    .map(x => x.body)
    .map((xml: string) => {
      const jsonOrError = xml2Json(xml);

      if (jsonOrError instanceof Error) throw jsonOrError;

      return jsonOrError;
    })
    .map(readResponse)
    .flatten()
    .filter(service => service.statename !== 'RUNNING')
    .pluck('name');
