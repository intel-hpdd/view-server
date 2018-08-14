import highland from 'highland';

describe('render request error', () => {
  let renderRequestError, mockGetUname, mockTemplates, stream, res;

  beforeEach(() => {
    res = {
      clientRes: {
        end: jest.fn()
      }
    };

    mockTemplates = {
      'backend_error.html': jest.fn(() => 'backend error')
    };
    jest.mock('../../../source/lib/templates.js', () => mockTemplates);

    stream = highland();

    mockGetUname = jest.fn(() => stream);
    jest.mock('../../../source/lib/get-uname.js', () => mockGetUname);

    renderRequestError = require('../../../source/lib/render-request-error').default;
  });

  it('should render a backend error', () => {
    renderRequestError(res, () => 'uh-oh')(new Error('boom!'));

    stream.write({ corosync: 'STOPPED' });

    expect(mockTemplates['backend_error.html']).toHaveBeenCalledOnceWith({
      description: 'uh-oh',
      debug_info: { corosync: 'STOPPED' }
    });
  });

  it('should send the rendered body', () => {
    renderRequestError(res, () => 'uh-oh')(new Error('boom!'));

    stream.write({ corosync: 'STOPPED' });

    expect(res.clientRes.end).toHaveBeenCalledOnceWith('backend error');
  });

  it('should handle a function for description', () => {
    renderRequestError(res, err => {
      return 'error was ' + err.message;
    })(new Error('boom!'));

    stream.write({ corosync: 'STOPPED' });

    expect(mockTemplates['backend_error.html']).toHaveBeenCalledOnceWith({
      description: 'error was boom!',
      debug_info: { corosync: 'STOPPED' }
    });
  });
});
