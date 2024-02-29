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
import { Me, UserHasLoginMiddleware } from "../../../middlewares/user.mdw";
import { BlogUserEntity } from "../../../entities/user.entity";

@Controller.Injectable()
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(), UserHasLoginMiddleware)
@Swagger.Definition(SwaggerWithUser, path => {
  path
    .summary('更新个人信息')
    .description('任何用户的个人信息更新操作')
    .consumes('application/x-www-form-urlencoded', 'application/json')
    .produces('application/json');

  path.addParameter('nickname', '昵称').In('formData').schema(new Schema.String()).required();
  path.addParameter('email', '邮箱').In('formData').schema(new Schema.String());
  path.addParameter('avatar', '头像').In('formData').schema(new Schema.String());
  path.addParameter('website', '个人网站').In('formData').schema(new Schema.String());

  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.Number().description('时间戳')));
})
export default class extends Controller {
  @Controller.Inject(UserService)
  private readonly user: UserService;

  @Controller.Inject(UserCache)
  private readonly cache: UserCache;

  public async main(
    @Me me: BlogUserEntity,
    @Controller.Body
    body: {
      nickname: string,
      email: string,
      avatar: string,
      website: string,
    }
  ) {
    let user = await this.user.getOneById(me.id);
    if (!user) throw new Exception(404, '用户不存在');
    user = await this.user.save(user.updateProfile(body.nickname, body.email, body.avatar, body.website));
    await this.cache.write({ account: user.account });

    return Response.json(Date.now());
  }
}