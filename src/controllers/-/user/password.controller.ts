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
import { HttpBodyMiddleware } from "../../../middlewares/http.body.mdw";
import { DataBaseMiddleware } from "../../../middlewares/database.mdw";
import { Swagger, SwaggerWithUser, createApiSchema } from "../../../lib/swagger/swagger";
import { Schema } from "../../../lib/schema/schema.lib";
import { UserService } from "../../../services/user.service";
import { Exception } from "../../../lib/exception";
import { UserCache } from "../../../caches/user.cache";
import { BlogVariable } from "../../../applications/variable.app";
import { Me, UserHasLoginMiddleware } from "../../../middlewares/user.mdw";
import { BlogUserEntity } from "../../../entities/user.entity";

@Controller.Injectable()
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(), UserHasLoginMiddleware)
@Swagger.Definition(SwaggerWithUser, path => {
  path
    .summary('更新密码')
    .description('任何用户的密码更新操作')
    .consumes('application/x-www-form-urlencoded', 'application/json')
    .produces('application/json');

  path.addParameter('oldPassword', '旧密码').In('formData').required().schema(new Schema.String());
  path.addParameter('newPassword', '新密码').In('formData').required().schema(new Schema.String());

  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.Number().description('时间戳')));
})
export default class extends Controller {
  @Controller.Inject(UserService)
  private readonly user: UserService;

  @Controller.Inject(UserCache)
  private readonly cache: UserCache;

  @Controller.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  public async main(
    @Me me: BlogUserEntity,
    @Controller.Body
    body: {
      oldPassword: string,
      newPassword: string,
    }
  ) {
    let user = await this.user.getOneById(me.id);
    if (!user) throw new Exception(404, '用户不存在');
    if (!user.checkPassword(body.oldPassword)) throw new Exception(410, '密码错误');
    user = await this.user.save(user.updatePassword(body.newPassword).updateToken());
    await this.cache.write({ account: user.account });

    const maxAgeSec = await this.user.updateUserMetaByCache(user.account, user.token);
    const domain = new URL(this.configs.get('domain'));

    return Response.json(Date.now()).cookie('authorization', user.token, {
      expires: new Date(Date.now() + maxAgeSec * 1000),
      signed: true,
      path: '/',
      httpOnly: true,
      domain: '.' + domain.hostname,
    })
  }
}