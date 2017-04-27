import fs from 'fs';
import readResponse from '../../../source/supervisor/read-response.js';

import { describe, beforeEach, it, expect } from '../../jasmine.js';

describe('read response', () => {
  let json, converted;

  beforeEach(() => {
    json = JSON.parse(
      fs.readFileSync('./test/fixtures/supervisor-response.json', 'utf8')
    );
    converted = JSON.parse(
      fs.readFileSync(
        './test/fixtures/converted-supervisor-services.json',
        'utf8'
      )
    );
  });

  it('should get converted services out', () => {
    expect(readResponse(json)).toEqual(converted);
  });
});
