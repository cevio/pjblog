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

import { container } from '@zille/application';
import { TypeORM } from '@zille/typeorm';
import { Middleware } from 'koa';
export const DataBaseConnnectionNameSpace = Symbol('DATABASE:CONNECTION');
export const DataBaseConnnectionRollbackNameSpace = Symbol('DATABASE:CONNECTION:ROLLBACK');
export function DataBaseMiddleware(transacte?: true): Middleware {
  return async (ctx, next) => {
    const typeorm = await container.connect(TypeORM);
    const store = ctx.__SERVICE_STORAGE__;

    if (transacte) {
      await typeorm.transaction(async (runner, rollback) => {
        store.addCache(DataBaseConnnectionNameSpace, runner);
        store.addCache(DataBaseConnnectionRollbackNameSpace, rollback);
        await next();
      })
    } else {
      store.addCache(DataBaseConnnectionNameSpace, typeorm.connection);
      await next();
    }
  }
}