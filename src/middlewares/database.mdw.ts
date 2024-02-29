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

import { create } from '@zille/core';
import { TypeORM } from '@zille/typeorm';
import { Middleware } from 'koa';
export const DataBaseConnnectionNameSpace = Symbol('DATABASE:CONNECTION');
export const DataBaseConnnectionRollbackNameSpace = Symbol('DATABASE:CONNECTION:ROLLBACK');
export function DataBaseMiddleware(transacte?: true): Middleware {
  return async (ctx, next) => {
    const typeorm = await create(TypeORM);
    const store = ctx.state['SERVICE:STORE'] as Map<any, any>;

    if (transacte) {
      await typeorm.transaction(async (runner, rollback) => {
        store.set(DataBaseConnnectionNameSpace, runner);
        store.set(DataBaseConnnectionRollbackNameSpace, rollback);
        await next();
      })
    } else {
      store.set(DataBaseConnnectionNameSpace, typeorm.connection);
      await next();
    }
  }
}