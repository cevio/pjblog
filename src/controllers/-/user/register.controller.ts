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

import { Controller, Response } from '@zille/http-controller';
import { JSONErrorCatch } from '../../../middlewares/catch.mdw';
import { Swagger, SwaggerWithUser, createApiSchema } from '../../../lib/swagger/swagger';
import { Schema } from '../../../lib/schema/schema.lib';
import { UserService } from '../../../services/user.service';
import { BlogVariable } from '../../../applications/variable.app';
import { Exception } from '../../../lib/exception';
import { UserCache } from '../../../caches/user.cache';
import { DataBaseMiddleware } from '../../../middlewares/database.mdw';
import { HttpBodyMiddleware } from '../../../middlewares/http.body.mdw';

@Controller.Injectable()
@Controller.Method('PUT')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware())
@Swagger.Definition(SwaggerWithUser, path => {
  path
    .summary('注册新用户')
    .description('通过账号密码注册新的用户')
    .consumes('application/x-www-form-urlencoded', 'application/json')
    .produces('application/json');

  path.addParameter('account', '账号').In('formData').required().schema(new Schema.String().required());
  path.addParameter('password', '密码').In('formData').required().schema(new Schema.String().required());
  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.Number()));
})
export default class extends Controller {
  @Controller.Inject(UserService)
  private readonly user: UserService;

  @Controller.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  @Controller.Inject(UserCache)
  private readonly cache: UserCache;

  public async main(
    @Controller.Body
    body: {
      account: string,
      password: string,
    }
  ) {
    if (!this.configs.get('registable')) {
      throw new Exception(413, '未开放注册');
    }

    let user = await this.user.getOneByAccount(body.account);
    if (user) throw new Exception(414, '用户已存在');

    user = await this.user.add(body.account, body.password);
    await this.cache.write({ account: user.account });

    const maxAgeSec = await this.user.addNewUserMetaByCache(user.account, user.token);
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