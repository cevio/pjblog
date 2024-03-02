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
import { JSONErrorCatch } from "../../../../../middlewares/catch.mdw";
import { DataBaseMiddleware } from "../../../../../middlewares/database.mdw";
import { UserAdminableMiddleware } from "../../../../../middlewares/user.mdw";
import { Swagger, SwaggerWithPage, createApiSchema } from "../../../../../lib/swagger/swagger";
import { Schema } from "../../../../../lib/schema/schema.lib";
import { MediaService } from "../../../../../services/media.service";
import { HttpBodyMiddleware } from "../../../../../middlewares/http.body.mdw";
import { MediaMiddleware } from "../../../../../middlewares/media.mdw";
import { Media } from "../../../../../applications/media.app";
import { BlogMediaEntity } from "../../../../../entities/media.entity";

@Controller.Injectable()
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(), UserAdminableMiddleware, MediaMiddleware())
@Swagger.Definition(SwaggerWithPage, path => {
  path
    .summary('更新单页')
    .description('更新单页')
    .consumes('application/x-www-form-urlencoded', 'application/json')
    .produces('application/json');

  path.addParameter('token', 'token').In('path').required().schema(new Schema.String());
  path.addParameter('title', '标题').In('formData').required().schema(new Schema.String());
  path.addParameter('category', '分类').In('formData').required().schema(new Schema.Number());
  path.addParameter('description', '描述').In('formData').required().schema(new Schema.String().format('textarea'));
  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.Number()));
})
export default class extends Controller<'token'> {
  @Controller.Inject(MediaService)
  private readonly media: MediaService;
  public async main(
    @Media.One media: BlogMediaEntity,
    @Controller.Body body: {
      title: string,
      category: number,
      description: string,
    }
  ) {
    await this.media.save(media.update({
      title: body.title,
      category: body.category,
      description: body.description,
    }))
    return Response.json(Date.now())
  }
}