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
import { TransformStringToNumber } from "../../../../../utils";
import { BlogVariable } from "../../../../../applications/variable.app";
import { MediaCommentService } from "../../../../../services/media.comment.service";
import { Swagger, SwaggerWithComment, createApiSchema } from "../../../../../lib/swagger/swagger";
import { Schema } from "../../../../../lib/schema/schema.lib";
import { CommentSchema } from "../../../../../schemas/comment.schema";

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, DataBaseMiddleware(), MediaMiddleware())
@Swagger.Definition(SwaggerWithComment, path => {
  path
    .summary('获取评论')
    .description('[主题可调用] 获取评论')
    .produces('application/json');

  path.addParameter('token', 'token').In('path').required().schema(new Schema.String());
  path.addParameter('page', '当前页').In('query').required().schema(new Schema.Number(1));
  path.addParameter('parent', '父评论 id').In('query').schema(new Schema.Number(0));
  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.Array().items(CommentSchema)));
})
export class GetMediaCommentsController extends Controller<'token', 'page' | 'parent'> {
  @Controller.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  @Controller.Inject(MediaCommentService)
  private readonly comment: MediaCommentService;

  public async main(
    @Controller.Query('page', TransformStringToNumber(1)) page: number,
    @Controller.Query('parent', Number) parent: number,
  ) {
    const size = parent === 0
      ? this.configs.get('mediaCommentWithPageSize')
      : this.configs.get('mediaCommentWithChildrenPageSize');

    if (!this.configs.get('mediaCommentable')) {
      return Response.json([])
        .set('x-page', page)
        .set('x-size', size)
        .set('x-total', 0)
    }

    const [dataSource, total] = await this.comment.getMany(page, size, parent);

    return Response.json(dataSource)
      .set('x-page', page)
      .set('x-size', size)
      .set('x-total', total)
  }
}