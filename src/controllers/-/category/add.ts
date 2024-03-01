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
import { CategorySchema } from "../../../schemas/category.schema";
import { CategoryService } from "../../../services/category.service";
import { HttpBodyMiddleware } from "../../../middlewares/http.body.mdw";
import { CategoryCache } from "../../../caches/category.cache";

@Controller.Injectable()
@Controller.Method('PUT')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithCategory, path => {
  path
    .summary('添加分类')
    .description('添加一个新的分类')
    .consumes('application/x-www-form-urlencoded', 'application/json')
    .produces('application/json');

  path.addParameter('name', '分类名').In('formData').required().schema(new Schema.String());
  path.addParameter('link', '外链地址').In('formData').required().schema(new Schema.String());
  path.addResponse(200, '请求成功').schema(createApiSchema(CategorySchema));
})
export class AddCategoryController extends Controller {
  @Controller.Inject(CategoryService)
  private readonly category: CategoryService;

  @Controller.Inject(CategoryCache)
  private readonly cache: CategoryCache;

  public async main(
    @Controller.Body
    body: {
      name: string,
      link?: string,
    }
  ) {
    const category = await this.category.add(body.name, body.link);
    await this.cache.write();
    return Response.json(category);
  }
}