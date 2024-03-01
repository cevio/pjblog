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

import { Controller, Response } from "@zille/http-controller";
import { Logins } from "../../../../applications/logins.app";
import { Swagger, SwaggerWithGlobal } from "../../../../lib/swagger/swagger";
import { Schema } from "../../../../lib/schema/schema.lib";
import { Exception } from "../../../../lib/exception";
import { Context } from "koa";
import { NormalErrorCatch } from "../../../../middlewares/catch.mdw";

const HttpContext = Controller.Context(ctx => ctx);

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(NormalErrorCatch)
@Swagger.Definition(SwaggerWithGlobal, path => {
  path
    .summary('登录方式跳转')
    .description('登录方式跳转')
    .produces('text/plain');

  path.addParameter('id', '登录模块 ID').In('path').schema(new Schema.String()).required();
  path.addParameter('redirect_url', '来源地址').In('query').schema(new Schema.String());
  path.addResponse(604, '请求成功').schema(new Schema.String());
})
export default class extends Controller<'id', 'redirect_url'> {
  @Controller.Inject(Logins)
  private readonly logins: Logins;

  public async main(
    @Controller.Param('id') id: string,
    @Controller.Query('redirect_url') url: string,
    @HttpContext ctx: Context,
  ) {
    if (!this.logins.has(id)) throw new Exception(604, '未知登录模式');
    const { redirect } = this.logins.get(id);
    await Promise.resolve(redirect(ctx, url));
    return Response.null();
  }
}