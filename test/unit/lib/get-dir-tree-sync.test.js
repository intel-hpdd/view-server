import path from "path";

describe("get dir tree sync", () => {
  let mockFs, getDirTreeSync;

  beforeEach(() => {
    mockFs = {
      readdirSync: jest.fn(),
      readFileSync: jest.fn(() => "foo"),
      statSync: jest.fn(filePath => {
        const isFile = filePath.indexOf(".html") !== -1;

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
    jest.mock("fs", () => mockFs);

    jest.spyOn(path, "join");

    mockFs.readdirSync.mockImplementation(dir => {
      if (dir === "/a/b/dir/") return ["file2.html"];
      else if (dir === "/a/b/") return ["file.html", "dir"];
    });

    getDirTreeSync = require("../../../source/lib/get-dir-tree-sync").default;
  });

  it("should build a file list", () => {
    expect(getDirTreeSync("/a/b/", stripPath)).toEqual({
      "file.html": "foo",
      "dir/file2.html": "foo"
    });
  });

  [
    {
      dir: "/a/b/",
      file: "file.html"
    },
    {
      dir: "/a/b/",
      file: "dir"
    },
    {
      dir: "/a/b/dir/",
      file: "file2.html"
    }
  ].forEach(function testPathJoins(pathData) {
    it("path.join to be called with the directory and file", () => {
      getDirTreeSync("/a/b/", stripPath);
      expect(path.join).toHaveBeenCalledWith(pathData.dir, pathData.file);
    });
  });
});

function stripPath(path) {
  return path.replace("/a/b/", "");
}
