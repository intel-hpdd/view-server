import * as fp from '@mfl/fp';
import highland from 'highland';
import proxyquire from '../../proxyquire.js';

import { describe, beforeEach, it, jasmine, expect } from '../../jasmine.js';

describe('get stopped supervisor services', () => {
  let xml2Json,
    getSupervisorCredentials,
    readResponse,
    getStoppedSupervisorServices,
    getServicesRequest;

  beforeEach(() => {
    readResponse = jasmine.createSpy('readResponse').and.returnValue([]);

    getServicesRequest = jasmine.createSpy('getServicesRequest').and.callFake(
      fp.always(
        highland([
          {
            body: 'some xml'
          }
        ])
      )
    );

    xml2Json = jasmine.createSpy('xml2Json').and.returnValue('some json');

    getSupervisorCredentials = jasmine
      .createSpy('getSupervisorCredentials')
      .and.returnValue(highland([null]));

    getStoppedSupervisorServices = proxyquire(
      '../source/supervisor/get-stopped-supervisor-services',
      {
        '@mfl/xml-2-json': xml2Json,
        './get-supervisor-credentials.js': getSupervisorCredentials,
        './get-services-request.js': getServicesRequest,
        './read-response.js': readResponse
      }
    ).default;
  });

  it('should call getServicesRequest', () => {
    getStoppedSupervisorServices().each(fp.noop);
    expect(getServicesRequest).toHaveBeenCalledOnce();
  });

  it('should call xml2Json', () => {
    getStoppedSupervisorServices().each(fp.noop);

    expect(xml2Json).toHaveBeenCalledOnceWith('some xml');
  });

  it('should throw if xml2Json returns an error instance', done => {
    xml2Json.and.returnValue(new Error('boom!'));

    getStoppedSupervisorServices()
      .errors(err => {
        expect(err).toEqual(new Error('boom!'));
        done();
      })
      .each(done.fail);
  });

  it('should call readResponse', () => {
    getStoppedSupervisorServices().each(fp.noop);

    expect(readResponse).toHaveBeenCalledOnceWith('some json');
  });

  it('should return the non-running services', done => {
    readResponse.and.returnValue([
      {
        statename: 'RUNNING',
        name: 'realtime'
      },
      {
        statename: 'STOPPED',
        name: 'corosync'
      }
    ]);

    getStoppedSupervisorServices().errors(done.fail).apply(x => {
      expect(x).toEqual('corosync');

      done();
    });
  });
});
