describe("view router", () => {
  let mockGetRouter, router, mockGetSession, mockGetCache, instance;

  beforeEach(() => {
    router = {
      addStart: jest.fn(r)
    };

    mockGetRouter = jest.fn(r);
    jest.mock("@iml/router", () => mockGetRouter);

    mockGetSession = function getSession() {};
    jest.mock("../../source/middleware/get-session.js", () => mockGetSession);

    mockGetCache = function getCache() {};
    jest.mock("../../source/middleware/get-cache", () => mockGetCache);

    instance = require("../../source/view-router").default;

    function r() {
      return router;
    }
  });

  it("should return a router", () => {
    expect(instance).toEqual(router);
  });

  it("should get the session on start", () => {
    expect(router.addStart).toHaveBeenCalledOnceWith(mockGetSession);
  });

  it("should get the cache on start", () => {
    expect(router.addStart).toHaveBeenCalledOnceWith(mockGetCache);
  });
});
