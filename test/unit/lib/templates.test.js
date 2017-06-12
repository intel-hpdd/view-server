import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect,
  jest
} from '../../jasmine.js';

describe('templates', () => {
  let templates, mockConf, mockGetDirTreeSync;

  beforeEach(() => {
    mockGetDirTreeSync = jasmine.createSpy('getDirTreeSync').and.returnValue({
      'e.html':
        '<$= a $> <$= t("f.html") $> <$= conf.TEMPLATE_ROOT $> <$- html $>',
      'f.html': 'bar'
    });
    jest.mock('../source/lib/get-dir-tree-sync.js', () => mockGetDirTreeSync);

    mockConf = {
      TEMPLATE_ROOT: '/a/b/c'
    };
    jest.mock('../source/conf.js', () => mockConf);

    templates = require('../../../source/lib/templates').default;
  });

  it('should populate a template as expected', () => {
    expect(
      templates['e.html']({
        a: 'a',
        html: '<script>console.log("foo");</script>'
      })
    ).toEqual(
      'a bar /a/b/c &lt;script&gt;console.log(&quot;foo&quot;);&lt;/script&gt;'
    );
  });
});
