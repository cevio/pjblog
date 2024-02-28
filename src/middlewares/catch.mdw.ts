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
import { Context, Next } from 'koa';
import { Logger } from '../applications/logger.app';

export async function JSONErrorCatch(ctx: Context, next: Next) {
  try {
    await next();
    ctx.body = {
      status: 200,
      data: ctx.body,
    }
  } catch (e) {
    const logger = await create(Logger);
    logger.error(e.message);
    ctx.body = {
      status: e.status || ctx.status || 500,
      message: e.message,
    }
  }
}

export async function NormalErrorCatch(ctx: Context, next: Next) {
  try {
    await next();
  } catch (e) {
    const logger = await create(Logger);
    logger.error(e.message);
    ctx.body = e.message;
  }
}