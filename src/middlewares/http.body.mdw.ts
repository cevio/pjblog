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

import { container } from "@zille/application";
import { Middleware } from "koa";
import { koaBody } from 'koa-body';
import { BlogVariable } from "../applications/variable.app";

/**
 * 获取请求体数据
 * @param ctx 
 * @param next 
 */
export const HttpBodyMiddleware: Middleware = async (ctx, next) => {
  const configs = await container.connect(BlogVariable);
  await koaBody({
    jsonStrict: false,
    jsonLimit: configs.get('bodyJSONLimit') + 'mb',
    formLimit: configs.get('bodyFORMLimit') + 'mb',
    textLimit: configs.get('bodyFORMLimit') + 'mb',
    multipart: true,
  })(ctx, next);
}