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

import { Context, Middleware } from "koa";
import { MediaService } from "../services/media.service";
import { Exception } from "../lib/exception";
import { Media } from "../applications/media.app";

export function MediaMiddleware(ider?: (ctx: Context) => string | number): Middleware {
  return async (ctx, next) => {
    const store = ctx.__SERVICE_STORAGE__;
    const service = await store.connect(MediaService);
    const id = typeof ider === 'function' ? ider(ctx) : ctx.params.token;
    const media = typeof id === 'number'
      ? await service.getOneById(id)
      : await service.getOneByToken(id);

    if (!media) throw new Exception(804, '媒体不存在');

    store.addCache(Media.Middleware_Store_NameSpace, ctx.media = media);

    await next();
  }
}