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
import { UserAdminableMiddleware } from "../../../middlewares/user.mdw";
import { Swagger, SwaggerWithCategory, createApiSchema } from "../../../lib/swagger/swagger";
import { Schema } from "../../../lib/schema/schema.lib";
import { CategoryService } from "../../../services/category.service";
import { HttpBodyMiddleware } from "../../../middlewares/http.body.mdw";
import { Exception } from "../../../lib/exception";
import { CategoryCache } from "../../../caches/category.cache";

@Controller.Injectable()
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithCategory, path => {
  path
    .summary('更新分类排序')
    .description('更新分类排序')
    .consumes('application/json')
    .produces('application/json');

  path.addParameter('body', '排序数组').In('body').schema(
    new Schema.Array()
      .items(
        new Schema.Number().description('分类 ID')
      )
  ).required();

  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.Number().description('时间戳')));
})
export default class extends Controller {
  @Controller.Inject(CategoryService)
  private readonly category: CategoryService;

  @Controller.Inject(CategoryCache)
  private readonly cache: CategoryCache;

  public async main(@Controller.Body body: number[]) {
    for (let i = 0; i < body.length; i++) {
      const id = body[i];
      const category = await this.category.getOneById(id);
      if (!category) throw new Exception(704, '分类不存在');
      await this.category.save(category.updateOrder(i));
    }
    await this.cache.write();
    return Response.json(Date.now());
  }
}