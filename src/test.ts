/**
 * Copyright (c) PJBlog Platforms, net. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author evio<evio@vip.qq.com>
 * @Website https://www.pjhome.net
 */

'use strict';

import blog from './index';

blog({
  http: {
    port: 3000,
  },
  cache: {
    type: 'redis',
  },
  database: {
    "type": "mysql",
    "host": "127.0.0.1",
    "port": 3306,
    "username": "root",
    "password": "fdnsyj211314",
    "database": "npm"
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
  }
})