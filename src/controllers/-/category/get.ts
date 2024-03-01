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

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, DataBaseMiddleware(), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithCategory, path => {
  path
    .summary('获取所有分类列表')
    .description('后台系统获取分类列表')
    .produces('application/json');

  path.addResponse(200, '请求成功').schema(createApiSchema(
    new Schema.Array()
      .items(CategorySchema)
  ));
})
export class GetCategoriesController extends Controller {
  @Controller.Inject(CategoryService)
  private readonly category: CategoryService;

  public async main() {
    return Response.json(await this.category.getMany())
  }
}