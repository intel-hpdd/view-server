var readFileSync = require('fs').readFileSync;
var readResponse = require('../../../supervisor/read-response');

describe('read response', function () {
  var json, converted;

  beforeEach(function () {
    json = JSON.parse(readFileSync('./test/fixtures/supervisor-response.json', 'utf8'));
    converted = JSON.parse(readFileSync('./test/fixtures/converted-supervisor-services.json', 'utf8'));
  });

  it('should get converted services out', function () {
    expect(readResponse(json)).toEqual(converted);
  });
});
