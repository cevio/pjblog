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
import { MediaService } from "../../../../../services/media.service";
import { HttpBodyMiddleware } from "../../../../../middlewares/http.body.mdw";
import { MediaMiddleware } from "../../../../../middlewares/media.mdw";
import { Media } from "../../../../../applications/media.app";
import { BlogMediaEntity } from "../../../../../entities/media.entity";
import { MediaArticleService } from "../../../../../services/media.article.service";
import { MediaTagService } from "../../../../../services/media.tag.service";

@Controller.Injectable()
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(), UserAdminableMiddleware, MediaMiddleware())
@Swagger.Definition(SwaggerWithArticle, path => {
  path
    .summary('更新文章')
    .description('更新文章')
    .consumes('application/json')
    .produces('application/json');

  const [definition] = path.addDefinition('Update.Props',
    new Schema.Object()
      .set('title', new Schema.String().description('标题'))
      .set('description', new Schema.String().description('摘要'))
      .set('markdown', new Schema.String().description('内容'))
      .set('category', new Schema.Number().description('分类 ID'))
      .set('tags', new Schema.Array().items(new Schema.String().description('标签')))
      .set('source', new Schema.Array().items(new Schema.String().description('参考来源')))
  )

  path.addParameter('token', '媒体 token').In('path').required().schema(new Schema.String());
  path.addParameter('body', '发布需要的数据').In('body').required().schema(new Schema.Ref(definition));

  path.addResponse(200, '请求成功').schema(
    createApiSchema(
      new Schema.Number().description('时间戳')
    )
  )
})
export default class extends Controller<'token'> {
  @Controller.Inject(MediaService)
  private readonly media: MediaService;
  public async main(
    @Media.One media: BlogMediaEntity,
    @Controller.Store store: Map<any, any>,
    @Controller.Body body: {
      title: string,
      category: number,
      description: string,
      tags: string,
      source: string[],
      markdown: string,
    }
  ) {
    store.set(Media.Middleware_Store_NameSpace, await this.media.save(media.update({
      title: body.title,
      category: body.category,
      description: body.description,
    })))
    const Article = await this.$use(MediaArticleService);
    const Tag = await this.$use(MediaTagService);
    await Tag.update(...body.tags);
    await Article.add(body.markdown, body.source);
    return Response.json(Date.now())
  }
}