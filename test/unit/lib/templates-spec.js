'use strict';

var proxyquire = require('proxyquire').noPreserveCache().noCallThru();

describe('templates', function () {
  var templates, conf, getDirTreeSync;

  beforeEach(function () {
    getDirTreeSync = jasmine.createSpy('getDirTreeSync')
      .and.returnValue({
        'e.html': '<$= a $> <$= t("f.html") $> <$= conf.TEMPLATE_ROOT $> <$- html $>',
        'f.html': 'bar'
      });

    conf = {
      TEMPLATE_ROOT: '/a/b/c'
    };

    templates = proxyquire('../../../lib/templates', {
      './get-dir-tree-sync': getDirTreeSync,
      '../conf': conf
    });
  });

  it('should populate a template as expected', function () {
    expect(templates['e.html']({ a: 'a', html: '<script>console.log("foo");</script>' }))
      .toEqual('a bar /a/b/c &lt;script&gt;console.log(&quot;foo&quot;);&lt;/script&gt;');
  });
});
