import highland from 'highland';
import proxyquire from '../../proxyquire.js';

import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect
} from '../../jasmine.js';

describe('render request error', () => {
  let renderRequestError,
    getUname,
    templates,
    stream,
    res;

  beforeEach(() => {
    res = {
      clientRes: {
        end: jasmine.createSpy('end')
      }
    };

    templates = {
      'backend_error.html': jasmine.createSpy('backend error').and.returnValue('backend error')
    };

    stream = highland();

    getUname = jasmine.createSpy('getUname').and.returnValue(stream);

    renderRequestError = proxyquire('../source/lib/render-request-error', {
      './get-uname.js': getUname,
      './templates.js': templates
    }).default;
  });

  it('should render a backend error', () => {
    renderRequestError(res, () => 'uh-oh', new Error('boom!'));

    stream.write({ corosync: 'STOPPED' });

    expect(templates['backend_error.html']).toHaveBeenCalledOnceWith({
      description: 'uh-oh',
      debug_info: { corosync: 'STOPPED' }
    });
  });

  it('should send the rendered body', () => {
    renderRequestError(res, () => 'uh-oh', new Error('boom!'));

    stream.write({ corosync: 'STOPPED' });

    expect(res.clientRes.end).toHaveBeenCalledOnceWith('backend error');
  });

  it('should handle a function for description', () => {
    renderRequestError(res, (err) => {
      return 'error was ' + err.message;
    }, new Error('boom!'));

    stream.write({ corosync: 'STOPPED' });

    expect(templates['backend_error.html']).toHaveBeenCalledOnceWith({
      description: 'error was boom!',
      debug_info: { corosync: 'STOPPED' }
    });
  });
});
