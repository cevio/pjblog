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
import { JSONErrorCatch } from "../../../../../../middlewares/catch.mdw";
import { DataBaseMiddleware } from "../../../../../../middlewares/database.mdw";
import { MediaMiddleware } from "../../../../../../middlewares/media.mdw";
import { MediaCommentService } from "../../../../../../services/media.comment.service";
import { Swagger, SwaggerWithComment, createApiSchema } from "../../../../../../lib/swagger/swagger";
import { Schema } from "../../../../../../lib/schema/schema.lib";
import { HttpBodyMiddleware } from "../../../../../../middlewares/http.body.mdw";
import { Me, UserHasLoginMiddleware } from "../../../../../../middlewares/user.mdw";
import { Exception } from "../../../../../../lib/exception";
import { BlogUserEntity } from "../../../../../../entities/user.entity";

@Controller.Injectable()
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(), UserHasLoginMiddleware, MediaMiddleware())
@Swagger.Definition(SwaggerWithComment, path => {
  path
    .summary('更新评论')
    .description('[主题可调用] 更新评论')
    .consumes('application/x-www-form-urlencoded', 'application/json')
    .produces('application/json');

  path.addParameter('token', 'token').In('path').required().schema(new Schema.String());
  path.addParameter('id', '评论id').In('path').required().schema(new Schema.Number());
  path.addParameter('content', '内容').In('formData').required().schema(new Schema.String());
  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.Number()));
})
export class UpdateMediaCommentsController extends Controller<'token' | 'id'> {
  @Controller.Inject(MediaCommentService)
  private readonly comment: MediaCommentService;

  public async main(
    @Me me: BlogUserEntity,
    @Controller.Param('id', Number) id: number,
    @Controller.Body body: {
      content: string,
    },
  ) {
    const comment = await this.comment.getOneById(id);
    if (!comment) throw new Exception(804, '评论不存在');
    if (comment.user_id !== me.id) throw new Exception(802, '不允许操作此评论');
    await this.comment.save(comment.updateContent(body.content));
    return Response.json(Date.now());
  }
}