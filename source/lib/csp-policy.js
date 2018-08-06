// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default "default-src 'none';\
 child-src 'self';\
 script-src 'self' 'unsafe-inline' 'unsafe-eval';\
 connect-src 'self' wss:;\
 img-src 'self' data:;\
 font-src 'self';\
 style-src 'self' 'unsafe-inline';";
