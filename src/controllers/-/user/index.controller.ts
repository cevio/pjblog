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
import { UserAdminableMiddleware } from "../../../middlewares/user.mdw";
import { JSONErrorCatch } from "../../../middlewares/catch.mdw";
import { DataBaseMiddleware } from "../../../middlewares/database.mdw";
import { Swagger, SwaggerWithUser, createApiSchema } from "../../../lib/swagger/swagger";
import { Schema } from "../../../lib/schema/schema.lib";
import { UserSchema } from "../../../schemas/user.schema";
import { TransformStringToNumber } from "../../../utils";
import { UserService } from "../../../services/user.service";

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, DataBaseMiddleware(), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithUser, path => {
  path
    .summary('获取用户列表')
    .description('后台系统获取用户列表')
    .produces('application/json');

  path.addParameter('page', '页码').In('query').required().schema(new Schema.Number(1)).required();
  path.addParameter('size', '分页大小').In('query').required().schema(new Schema.Number(10)).required();
  path.addParameter('keyowrd', '关键字').In('query').schema(new Schema.String());
  path.addParameter('forbiden', '是否搜索禁止用户列表 1: 是 0: 否').In('query').schema(new Schema.Number(0).enum(1, 0));
  path.addParameter('admin', '是否管理员').In('query').schema(new Schema.Number().enum(0, 1));

  path.addResponse(200, '请求成功').schema(
    createApiSchema(
      new Schema.Array()
        .description('用户列表')
        .items(UserSchema)
    )
  );
})
export default class extends Controller<null, 'page' | 'size' | 'keyword' | 'forbiden' | 'admin'> {
  @Controller.Inject(UserService)
  private readonly user: UserService;

  public async main(
    @Controller.Query('keyword') keyword: string,
    @Controller.Query('page', TransformStringToNumber(1)) page: number,
    @Controller.Query('size', TransformStringToNumber(10)) size: number,
    @Controller.Query('forbiden', TransformStringToNumber(0), Boolean) forbiden: boolean,
    @Controller.Query('admin', TransformStringToNumber(0), Boolean) admin: boolean,
  ) {
    const { total, data } = await this.user.getMany(page, size, {
      keyword, forbiden, admin,
    })
    return Response.json(data)
      .set('x-page', page)
      .set('x-size', size)
      .set('x-total', total);
  }
}