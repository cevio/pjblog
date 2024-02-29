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
import { Swagger, SwaggerWithGlobal, createApiSchema } from "../../../lib/swagger/swagger";
import { Schema } from "../../../lib/schema/schema.lib";
import { BlogVariable } from "../../../applications/variable.app";

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, DataBaseMiddleware(), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithGlobal, path => {
  path
    .summary('获取全局配置')
    .description('获取全局配置')
    .produces('application/json')

  path.addResponse(200, '请求成功').schema(createApiSchema(
    new Schema.Object()
      .set('schema', new Schema.Object())
      .set('value', new Schema.Object())
  ));
})
export class GetConfigsController extends Controller {
  @Controller.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  public async main() {
    return Response.json({
      schema: this.configs.toSchema(),
      value: this.configs.toJSON(),
    })
  }
}