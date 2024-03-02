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
import { MediaMiddleware } from "../../../../../middlewares/media.mdw";
import { BlogVariable } from "../../../../../applications/variable.app";
import { MediaCommentService } from "../../../../../services/media.comment.service";
import { Swagger, SwaggerWithComment, createApiSchema } from "../../../../../lib/swagger/swagger";
import { Schema } from "../../../../../lib/schema/schema.lib";
import { HttpBodyMiddleware } from "../../../../../middlewares/http.body.mdw";
import { Me, UserHasLoginMiddleware } from "../../../../../middlewares/user.mdw";
import { Exception } from "../../../../../lib/exception";
import { BlogUserEntity } from "../../../../../entities/user.entity";
import { Media } from "../../../../../applications/media.app";
import { BlogMediaEntity } from "../../../../../entities/media.entity";
import { CommentSchema } from "../../../../../schemas/comment.schema";

@Controller.Injectable()
@Controller.Method('PUT')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(), UserHasLoginMiddleware, MediaMiddleware())
@Swagger.Definition(SwaggerWithComment, path => {
  path
    .summary('发表评论')
    .description('[主题可调用] 发表评论')
    .consumes('application/x-www-form-urlencoded', 'application/json')
    .produces('application/json');

  path.addParameter('token', 'token').In('path').required().schema(new Schema.String());
  path.addParameter('content', '内容').In('formData').required().schema(new Schema.String());
  path.addParameter('parent', '父评论 id').In('formData').schema(new Schema.Number());
  path.addResponse(200, '请求成功').schema(createApiSchema(CommentSchema));
})
export class AddMediaCommentsController extends Controller<'token'> {
  @Controller.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  @Controller.Inject(MediaCommentService)
  private readonly comment: MediaCommentService;

  public async main(
    @Me me: BlogUserEntity,
    @Media.One media: BlogMediaEntity,
    @Controller.Body body: {
      content: string,
      parent?: number,
    },
  ) {
    if (!this.configs.get('mediaCommentable') || !media.commentable) {
      throw new Exception(801, '不允许评论');
    }
    const comment = await this.comment.add(me.id, body.content, body.parent);
    return Response.json({
      id: comment.id,
      content: comment.content,
      gmtc: comment.gmt_create,
      gmtm: comment.gmt_modified,
      user: {
        nickname: me.nickname,
        avatar: me.avatar,
      }
    });
  }
}