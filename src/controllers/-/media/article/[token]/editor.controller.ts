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
import { Swagger, SwaggerWithArticle, createApiSchema } from "../../../../../lib/swagger/swagger";
import { Schema } from "../../../../../lib/schema/schema.lib";
import { MediaMiddleware } from "../../../../../middlewares/media.mdw";
import { Media } from "../../../../../applications/media.app";
import { BlogMediaEntity } from "../../../../../entities/media.entity";
import { MediaArticleService } from "../../../../../services/media.article.service";
import { MediaTagService } from "../../../../../services/media.tag.service";

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, DataBaseMiddleware(), UserAdminableMiddleware, MediaMiddleware())
@Swagger.Definition(SwaggerWithArticle, path => {
  path
    .summary('文章编辑器数据')
    .description('文章编辑器数据')
    .produces('application/json');

  path.addParameter('token', '媒体 token').In('path').required().schema(new Schema.String());
  path.addResponse(200, '请求成功').schema(
    createApiSchema(
      new Schema.Object()
        .set('title', new Schema.String().description('标题'))
        .set('description', new Schema.String().description('摘要'))
        .set('markdown', new Schema.String().description('内容'))
        .set('category', new Schema.Number().description('分类 ID'))
        .set('tags', new Schema.Array().items(new Schema.String().description('标签')))
        .set('source', new Schema.Array().items(new Schema.String().description('参考来源')))
    )
  )
})
export default class extends Controller<'token'> {
  @Controller.Inject(MediaArticleService)
  private readonly article: MediaArticleService;

  @Controller.Inject(MediaTagService)
  private readonly tag: MediaTagService;

  public async main(@Media.One media: BlogMediaEntity) {
    const article = await this.article.getOne();
    const tags = await this.tag.getMany();
    return Response.json({
      title: media.media_title,
      category: media.media_category,
      description: media.media_description,
      markdown: article.markdown,
      source: article.source,
      tags: tags.map(tag => tag.tag_name),
    })
  }
}