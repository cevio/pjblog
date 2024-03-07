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

import { Middleware } from "koa";
import { UserService } from "../services/user.service";
import { UserCache } from "../caches/user.cache";
import { container } from "@zille/application";
import { Storage } from "../applications/cache/cache.app";
import { BlogUserEntity } from "../entities/user.entity";
import { Controller } from '@zille/http-controller';
import { Exception } from "../lib/exception";

declare module 'koa' {
  interface BaseContext {
    user: BlogUserEntity,
  }
}

export const Me = Controller.Context(ctx => ctx.user);
export const UserLoginInfoMiddleware: Middleware = async (ctx, next) => {
  let token = ctx.cookies.get('authorization', { signed: true });
  if (!token) token = ctx.get('authorization');
  if (!token) return await next();

  const store = ctx.__SERVICE_STORAGE__;
  const user = await store.connect(UserService);
  const userCache = await store.connect(UserCache);
  const cache = await store.connect(Storage);

  const key = user.createUserLoginTokenKeyPath(token);
  if (!(await cache.connection.exists(key))) return await next();

  const { value } = await cache.connection.get<{ value: string, relative_key: string }>(key);
  const _user = await userCache.read({ account: value });
  ctx.user = _user;

  await next();
}

export const UserHasLoginMiddleware: Middleware = async (ctx, next) => {
  await UserLoginInfoMiddleware(ctx, async () => {
    if (!ctx.user) throw new Exception(401, '用户未登录');
    if (ctx.user.forbiden) throw new Exception(403, '用户禁止登录');
    return await next();
  })
}

export const UserAdminableMiddleware: Middleware = async (ctx, next) => {
  await UserHasLoginMiddleware(ctx, async () => {
    if (ctx.user.admin) return await next();
    throw new Exception(405, '非管理员禁止登录');
  })
}