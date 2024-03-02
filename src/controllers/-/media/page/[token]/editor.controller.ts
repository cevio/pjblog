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
import { MediaMiddleware } from "../../../../../middlewares/media.mdw";
import { Media } from "../../../../../applications/media.app";
import { BlogMediaEntity } from "../../../../../entities/media.entity";

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, DataBaseMiddleware(), UserAdminableMiddleware, MediaMiddleware())
@Swagger.Definition(SwaggerWithPage, path => {
  path
    .summary('单页编辑器数据')
    .description('单页编辑器数据')
    .produces('application/json');

  path.addParameter('token', '媒体 token').In('path').required().schema(new Schema.String());
  path.addResponse(200, '请求成功').schema(
    createApiSchema(
      new Schema.Object()
        .set('title', new Schema.String())
        .set('category', new Schema.Number())
        .set('description', new Schema.String())
    )
  )
})
export default class extends Controller<'token'> {
  public async main(@Media.One media: BlogMediaEntity) {
    return Response.json({
      title: media.media_title,
      category: media.media_category,
      description: media.media_description,
    })
  }
}