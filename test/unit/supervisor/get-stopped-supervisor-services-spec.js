'use strict';

var proxyquire = require('proxyquire').noPreserveCache().noCallThru();
var fp = require('intel-fp');
var λ = require('highland');

describe('get stopped supervisor services', function () {
  var xml2Json, getSupervisorCredentials, readResponse,
    getStoppedSupervisorServices, getServicesRequest;

  beforeEach(function () {
    readResponse = jasmine.createSpy('readResponse')
      .and.returnValue([]);

    getServicesRequest = jasmine.createSpy('getServicesRequest')
      .and
      .callFake(fp.always(λ([{
        body: 'some xml'
      }])));

    xml2Json = jasmine.createSpy('xml2Json')
      .and.returnValue('some json');

    getSupervisorCredentials = jasmine.createSpy('getSupervisorCredentials')
    .and
    .returnValue(λ([null]));

    getStoppedSupervisorServices = proxyquire('../../../supervisor/get-stopped-supervisor-services', {
      'intel-xml-2-json': {
        default: xml2Json
      },
      './get-supervisor-credentials': getSupervisorCredentials,
      './get-services-request': getServicesRequest,
      './read-response': readResponse
    });
  });

  it('should call getServicesRequest', function () {
    getStoppedSupervisorServices()
      .each(fp.noop);
    expect(getServicesRequest).toHaveBeenCalledOnce();
  });

  it('should call xml2Json', function () {
    getStoppedSupervisorServices()
      .each(fp.noop);

    expect(xml2Json).toHaveBeenCalledOnceWith('some xml');
  });

  it('should throw if xml2Json returns an error instance', function (done) {
    xml2Json.and.returnValue(new Error('boom!'));

    getStoppedSupervisorServices()
      .errors(function (err) {
        expect(err).toEqual(new Error('boom!'));
        done();
      })
      .each(done.fail);
  });

  it('should call readResponse', function () {
    getStoppedSupervisorServices()
      .each(fp.noop);

    expect(readResponse).toHaveBeenCalledOnceWith('some json');
  });

  it('should return the non-running services', function (done) {
    readResponse
      .and
      .returnValue([
        {
          statename: 'RUNNING',
          name: 'realtime'
        },
        {
          statename: 'STOPPED',
          name: 'corosync'
        }
      ]);

    getStoppedSupervisorServices()
      .errors(done.fail)
      .apply(function (x) {
        expect(x).toEqual('corosync');

        done();
      });
  });
});
