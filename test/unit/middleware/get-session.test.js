import highland from "highland";

describe("get session", () => {
  let getSession, mockApiRequest, mockRenderRequestError, renderRequestErrorInner, req, res, next, push;

  beforeEach(() => {
    req = {
      clientReq: {
        headers: {
          cookie: "foo"
        }
      }
    };

    res = {
      clientRes: {
        setHeader: jest.fn()
      }
    };

    next = jest.fn();

    mockApiRequest = jest.fn(() =>
      highland(_push_ => {
        push = (err, val) => {
          _push_(err, val);
          _push_(null, highland.nil);
        };
      })
    );

    jest.mock("../../../source/lib/api-request.js", () => mockApiRequest);

    renderRequestErrorInner = jest.fn();

    mockRenderRequestError = jest.fn(() => renderRequestErrorInner);

    jest.mock("../../../source/lib/render-request-error.js", () => mockRenderRequestError);

    getSession = require("../../../source/middleware/get-session").default;

    getSession(req, res, next);
  });

  it("should get a session", () => {
    expect(mockApiRequest).toHaveBeenCalledOnceWith({
      path: "/session",
      headers: {
        cookie: "foo"
      }
    });
  });

  it("should pass session data to the next function", () => {
    push(null, {
      headers: {
        "set-cookie": [
          "csrftoken=0GkwjZHBUq1DoLeg7M3cEfod8d0EjAAn; expires=Mon, 08-Feb-2016 17:12:32 GMT; Max-Age=31449600; Path=/",
          "sessionid=7dbd643025680726843284b5ba7402b1; expires=Mon, 23-Feb-2015 17:12:32 GMT; Max-Age=1209600; Path=/"
        ]
      },
      body: { session: "stuff" }
    });

    expect(next).toHaveBeenCalledOnceWith(req, res, {
      session: {
        session: "stuff"
      },
      cache: {},
      cacheCookie: "csrftoken=0GkwjZHBUq1DoLeg7M3cEfod8d0EjAAn; sessionid=7dbd643025680726843284b5ba7402b1;"
    });
  });

  it("should stop on error", () => {
    push(new Error("boom!"));

    expect(renderRequestErrorInner).toHaveBeenCalledOnceWith(new Error("boom!"), expect.any(Function));
  });
});
