import * as fp from "@iml/fp";

describe("index handlers", () => {
  let indexHandlers, mockTemplates, mockConf, req, res, data, next;

  beforeEach(() => {
    req = {};

    res = {
      clientRes: {
        setHeader: jest.fn(),
        end: jest.fn()
      },
      redirect: jest.fn()
    };

    data = {
      cache: {
        session: {
          user: {}
        }
      }
    };

    next = jest.fn();

    mockTemplates = {
      "index.html": jest.fn(() => "index"),
      "base.html": jest.fn(() => "base")
    };
    jest.mock("../../../source/lib/templates.js", () => mockTemplates);

    mockConf = {
      get: fp.always(false)
    };
    jest.mock("../../../source/conf.js", () => mockConf);

    indexHandlers = require("../../../source/lib/index-handlers").default;
  });

  it("should redirect if we don't have a user and disallow anonymous read", () => {
    delete data.cache.session.user;

    indexHandlers.newHandler(req, res, data, next);

    expect(res.redirect).toHaveBeenCalledOnceWith("/ui/login/");
  });

  it("should set the response header", () => {
    indexHandlers.newHandler(req, res, data, next);

    expect(res.clientRes.setHeader).toHaveBeenCalledOnceWith("Content-Type", "text/html; charset=utf-8");
  });

  it("should set the status code", () => {
    indexHandlers.newHandler(req, res, data, next);

    expect(res.clientRes.statusCode).toBe(200);
  });

  it("should render the template", () => {
    indexHandlers.newHandler(req, res, data, next);

    expect(mockTemplates["index.html"]).toHaveBeenCalledOnceWith({
      title: "",
      cache: data.cache
    });
  });

  it("should render the old template", () => {
    indexHandlers.oldHandler(req, res, data, next);

    expect(mockTemplates["base.html"]).toHaveBeenCalledOnceWith({
      title: "",
      cache: data.cache
    });
  });

  it("should end the response", () => {
    indexHandlers.newHandler(req, res, data, next);

    expect(res.clientRes.end).toHaveBeenCalledOnceWith("index");
  });

  it("should call next", () => {
    indexHandlers.newHandler(req, res, data, next);

    expect(next).toHaveBeenCalledOnceWith(req, res);
  });
});
