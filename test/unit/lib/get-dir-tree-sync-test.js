import path from 'path';
import proxyquire from '../../proxyquire.js';

import {
  describe,
  beforeEach,
  it,
  jasmine,
  expect,
  spyOn
} from '../../jasmine.js';

describe('get dir tree sync', () => {
  let fs, getDirTreeSync;

  beforeEach(() => {
    fs = {
      readdirSync: jasmine.createSpy('readdirSync'),
      readFileSync: jasmine.createSpy('readFileSync').and.returnValue('foo'),
      statSync: jasmine.createSpy('statSync').and.callFake(filePath => {
        const isFile = filePath.indexOf('.html') !== -1;

        return {
          isFile: function isAFile() {
            return isFile;
          },
          isDirectory: function isDirectory() {
            return !isFile;
          }
        };
      })
    };

    spyOn(path, 'join').and.callThrough();

    fs.readdirSync.and.callFake(dir => {
      if (dir === '/a/b/dir/') return ['file2.html'];
      else if (dir === '/a/b/') return ['file.html', 'dir'];
    });

    getDirTreeSync = proxyquire('../source/lib/get-dir-tree-sync', {
      fs,
      path
    }).default;
  });

  it('should build a file list', () => {
    expect(getDirTreeSync('/a/b/', stripPath)).toEqual({
      'file.html': 'foo',
      'dir/file2.html': 'foo'
    });
  });

  [
    {
      dir: '/a/b/',
      file: 'file.html'
    },
    {
      dir: '/a/b/',
      file: 'dir'
    },
    {
      dir: '/a/b/dir/',
      file: 'file2.html'
    }
  ].forEach(function testPathJoins(pathData) {
    it('path.join to be called with the directory and file', () => {
      getDirTreeSync('/a/b/', stripPath);
      expect(path.join).toHaveBeenCalledWith(pathData.dir, pathData.file);
    });
  });
});

function stripPath(path) {
  return path.replace('/a/b/', '');
}
