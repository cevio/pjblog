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
import { HttpBodyMiddleware } from "../../../middlewares/http.body.mdw";
import { SystemConfigs } from "../../../global.types";

@Controller.Injectable()
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithGlobal, path => {
  path
    .summary('保存全局配置')
    .description('保存全局配置')
    .consumes('application/json')
    .produces('application/json')

  path.addParameter('body', '配置参数').In('body').schema(new Schema.Object()).required();
  path.addResponse(200, '请求成功').schema(createApiSchema(
    new Schema.Number()
  ));
})
export class PostConfigsController extends Controller {
  @Controller.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  public async main(@Controller.Body body: Partial<SystemConfigs>) {
    await this.configs.save(body);
    return Response.json(Date.now());
  }
}