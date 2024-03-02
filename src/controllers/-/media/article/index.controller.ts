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
import { Swagger, SwaggerWithArticle, createApiSchema } from "../../../../lib/swagger/swagger";
import { Schema } from "../../../../lib/schema/schema.lib";
import { BlogUserEntity } from "../../../../entities/user.entity";
import { MediaService } from "../../../../services/media.service";
import { HttpBodyMiddleware } from "../../../../middlewares/http.body.mdw";
import { MediaArticleService } from "../../../../services/media.article.service";
import { MediaTagService } from "../../../../services/media.tag.service";
import { Media } from "../../../../applications/media.app";
import { Exception } from "../../../../lib/exception";

@Controller.Injectable()
@Controller.Method('PUT')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(true), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithArticle, path => {
  path
    .summary('添加文章')
    .description('添加文章')
    .consumes('application/json')
    .produces('application/json');

  const [definition] = path.addDefinition('Post.Props',
    new Schema.Object()
      .set('title', new Schema.String().description('标题'))
      .set('description', new Schema.String().description('摘要'))
      .set('markdown', new Schema.String().description('内容'))
      .set('category', new Schema.Number().description('分类 ID'))
      .set('tags', new Schema.Array().items(new Schema.String().description('标签')))
      .set('source', new Schema.Array().items(new Schema.String().description('参考来源')))
  )

  path.addParameter('body', '发布需要的数据').In('body').required().schema(new Schema.Ref(definition));
  path.addResponse(200, '请求成功').schema(
    createApiSchema(
      new Schema.Number().description('时间戳')
    )
  )
})
export default class extends Controller {
  @Controller.Inject(MediaService)
  private readonly media: MediaService;

  public async main(
    @Me me: BlogUserEntity,
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
    const media = await this.media.add(body.title, body.category, body.description, me.id, 'article');
    store.set(Media.Middleware_Store_NameSpace, media);

    const Article = await this.use(MediaArticleService);
    const article = await Article.getOne();
    if (!article) throw new Exception(804, '文章不存在');
    const Tag = await this.use(MediaTagService);
    await Tag.update(...body.tags);
    await Article.save(article.update(body.markdown, body.source));

    return Response.json(Date.now())
  }
}