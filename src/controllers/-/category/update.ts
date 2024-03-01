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
import { CategoryCache } from "../../../caches/category.cache";
import { Exception } from "../../../lib/exception";

@Controller.Injectable()
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithCategory, path => {
  path
    .summary('更新分类信息')
    .description('更新一个分类')
    .consumes('application/x-www-form-urlencoded', 'application/json')
    .produces('application/json');

  path.addParameter('id', '分类 ID').In('path').required().schema(new Schema.Number());
  path.addParameter('name', '分类名').In('formData').required().schema(new Schema.String());
  path.addParameter('link', '外链地址').In('formData').required().schema(new Schema.String());

  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.Number().description('时间戳')));
})
export class UpdateCategoryController extends Controller<'id'> {
  @Controller.Inject(CategoryService)
  private readonly category: CategoryService;

  @Controller.Inject(CategoryCache)
  private readonly cache: CategoryCache;

  public async main(
    @Controller.Param('id', Number) id: number,
    @Controller.Body body: {
      name: string,
      link?: string,
    }
  ) {
    let category = await this.category.getOneById(id);
    if (!category) throw new Exception(704, '分类不存在');
    category = category.updateName(body.name);
    if (body.link) category = category.updateLink(body.link);
    await this.category.save(category);
    await this.cache.write();
    return Response.json(Date.now());
  }
}