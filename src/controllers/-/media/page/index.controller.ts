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
import { JSONErrorCatch } from "../../../../middlewares/catch.mdw";
import { DataBaseMiddleware } from "../../../../middlewares/database.mdw";
import { Me, UserAdminableMiddleware } from "../../../../middlewares/user.mdw";
import { Swagger, SwaggerWithPage, createApiSchema } from "../../../../lib/swagger/swagger";
import { Schema } from "../../../../lib/schema/schema.lib";
import { BlogUserEntity } from "../../../../entities/user.entity";
import { MediaService } from "../../../../services/media.service";
import { HttpBodyMiddleware } from "../../../../middlewares/http.body.mdw";

@Controller.Injectable()
@Controller.Method('PUT')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithPage, path => {
  path
    .summary('添加单页')
    .description('添加单页')
    .consumes('application/x-www-form-urlencoded', 'application/json')
    .produces('application/json');

  path.addParameter('title', '标题').In('formData').required().schema(new Schema.String());
  path.addParameter('category', '分类').In('formData').required().schema(new Schema.Number());
  path.addParameter('description', '描述').In('formData').schema(new Schema.String().format('textarea'));
  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.Number()));
})
export default class extends Controller {
  @Controller.Inject(MediaService)
  private readonly media: MediaService;
  public async main(
    @Me me: BlogUserEntity,
    @Controller.Body body: {
      title: string,
      category: number,
      description: string,
    }
  ) {
    await this.media.add(body.title, body.category, body.description, me.id, 'page');
    return Response.json(Date.now())
  }
}