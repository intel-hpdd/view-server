// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import apiRequest from "../lib/api-request.js";
import renderRequestError from "../lib/render-request-error.js";

import type { routerReqT, routerResT } from "../view-router.js";

export type dataT = {
  session: Object,
  cacheCookie: string,
  cache: Object
};

export default (req: routerReqT, res: routerResT, next: Function) => {
  const cookie: string = req.clientReq.headers.cookie || "";

  apiRequest({
    path: "/session",
    headers: {
      cookie
    }
  })
    .stopOnError(renderRequestError(res, (err: Error) => `Exception rendering resources: ${err.stack}`))
    .each(response => {
      // Pass the session cookies to the client.
      res.clientRes.setHeader("Set-Cookie", response.headers["set-cookie"]);

      const data: dataT = {
        session: response.body,
        cache: {},
        cacheCookie: response.headers["set-cookie"]
          .map((x: string) => (x.match(/((?:csrftoken|sessionid)=[^;]+;)/) || [""])[0])
          .join(" ")
      };

      next(req, res, data);
    });
};
