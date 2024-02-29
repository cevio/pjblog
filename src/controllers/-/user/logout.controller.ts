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
import { JSONErrorCatch } from "../../../middlewares/catch.mdw";
import { DataBaseMiddleware } from "../../../middlewares/database.mdw";
import { Swagger, SwaggerWithUser, createApiSchema } from "../../../lib/swagger/swagger";
import { Schema } from "../../../lib/schema/schema.lib";
import { UserService } from "../../../services/user.service";
import { BlogVariable } from "../../../applications/variable.app";
import { Me, UserHasLoginMiddleware } from "../../../middlewares/user.mdw";
import { BlogUserEntity } from "../../../entities/user.entity";

@Controller.Injectable()
@Controller.Method('DELETE')
@Controller.Middleware(JSONErrorCatch, DataBaseMiddleware(), UserHasLoginMiddleware)
@Swagger.Definition(SwaggerWithUser, path => {
  path
    .summary('退出登录')
    .description('当前用户退出登录')
    .produces('application/json');

  path.addResponse(200, '请求成功')
    .schema(createApiSchema(new Schema.Number().description('时间戳')))
})
export default class extends Controller {
  @Controller.Inject(UserService)
  private readonly user: UserService;

  @Controller.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  public async main(@Me me: BlogUserEntity) {
    await this.user.deleteUserMetaByCache(me.account);
    const domain = new URL(this.configs.get('domain'));
    return Response.json(Date.now()).cookie('authorization', '', {
      expires: new Date(0),
      signed: true,
      path: '/',
      httpOnly: true,
      domain: '.' + domain.hostname,
    })
  }
}