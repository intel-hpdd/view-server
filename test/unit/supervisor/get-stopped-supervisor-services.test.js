import * as fp from '@mfl/fp';
import highland from 'highland';

import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect,
  jest
} from '../../jasmine.js';

describe('get stopped supervisor services', () => {
  let mockXml2Json,
    mockGetSupervisorCredentials,
    mockReadResponse,
    mockGetServicesRequest,
    getStoppedSupervisorServices;

  beforeEach(() => {
    mockReadResponse = jasmine.createSpy('readResponse').and.returnValue([]);
    jest.mock('../source/supervisor/read-response.js', () => mockReadResponse);

    mockGetServicesRequest = jasmine
      .createSpy('getServicesRequest')
      .and.callFake(
        fp.always(
          highland([
            {
              body: 'some xml'
            }
          ])
        )
      );
    jest.mock(
      '../source/supervisor/get-services-request.js',
      () => mockGetServicesRequest
    );

    mockXml2Json = jasmine.createSpy('xml2Json').and.returnValue('some json');
    jest.mock('@mfl/xml-2-json', () => mockXml2Json);

    mockGetSupervisorCredentials = jasmine
      .createSpy('getSupervisorCredentials')
      .and.returnValue(highland([null]));
    jest.mock(
      '../source/supervisor/get-supervisor-credentials.js',
      () => mockGetSupervisorCredentials
    );

    getStoppedSupervisorServices = require('../../../source/supervisor/get-stopped-supervisor-services').default;
  });

  it('should call getServicesRequest', () => {
    getStoppedSupervisorServices().each(fp.noop);
    expect(mockGetServicesRequest).toHaveBeenCalledOnce();
  });

  it('should call xml2Json', () => {
    getStoppedSupervisorServices().each(fp.noop);

    expect(mockXml2Json).toHaveBeenCalledOnceWith('some xml');
  });

  it('should throw if xml2Json returns an error instance', done => {
    mockXml2Json.and.returnValue(new Error('boom!'));

    getStoppedSupervisorServices()
      .errors(err => {
        expect(err).toEqual(new Error('boom!'));
        done();
      })
      .each(done.fail);
  });

  it('should call readResponse', () => {
    getStoppedSupervisorServices().each(fp.noop);

    expect(mockReadResponse).toHaveBeenCalledOnceWith('some json');
  });

  it('should return the non-running services', done => {
    mockReadResponse.and.returnValue([
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
