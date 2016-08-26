import proxyquire from '../../proxyquire.js';

import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect
} from '../../jasmine.js';

describe('templates', () => {
  let templates,
    conf,
    getDirTreeSync;

  beforeEach(() => {
    getDirTreeSync = jasmine
      .createSpy('getDirTreeSync')
      .and
      .returnValue({
        'e.html': '<$= a $> <$= t("f.html") $> <$= conf.TEMPLATE_ROOT $> <$- html $>',
        'f.html': 'bar'
      });

    conf = {
      TEMPLATE_ROOT: '/a/b/c'
    };

    templates = proxyquire('../source/lib/templates', {
      './get-dir-tree-sync.js': getDirTreeSync,
      '../conf.js': conf
    }).default;
  });

  it('should populate a template as expected', () => {
    expect(templates['e.html']({ a: 'a', html: '<script>console.log("foo");</script>' }))
      .toEqual('a bar /a/b/c &lt;script&gt;console.log(&quot;foo&quot;);&lt;/script&gt;');
  });
});
