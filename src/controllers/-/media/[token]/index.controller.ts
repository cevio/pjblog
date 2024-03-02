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
import { UserAdminableMiddleware } from "../../../../middlewares/user.mdw";
import { Swagger, SwaggerWithMedia, createApiSchema } from "../../../../lib/swagger/swagger";
import { Schema } from "../../../../lib/schema/schema.lib";
import { MediaService } from "../../../../services/media.service";
import { MediaMiddleware } from "../../../../middlewares/media.mdw";
import { BlogMediaEntity } from "../../../../entities/media.entity";
import { MediaTagService } from "../../../../services/media.tag.service";
import { Media } from "../../../../applications/media.app";
import { MediaArticleService } from "../../../../services/media.article.service";
import { Exception } from "../../../../lib/exception";

@Controller.Injectable()
@Controller.Method('DELETE')
@Controller.Middleware(JSONErrorCatch, DataBaseMiddleware(true), UserAdminableMiddleware, MediaMiddleware())
@Swagger.Definition(SwaggerWithMedia, path => {
  path
    .summary('删除媒体')
    .description('删除媒体')
    .produces('application/json');

  path.addParameter('token', 'token').In('path').required().schema(new Schema.String());
  path.addResponse(200, '请求成功').schema(
    createApiSchema(
      new Schema.Number()
    )
  );
})
export default class extends Controller<'token'> {
  @Controller.Inject(MediaService)
  private readonly media: MediaService;

  @Controller.Inject(MediaTagService)
  private readonly tag: MediaTagService;

  @Controller.Inject(MediaArticleService)
  private readonly article: MediaArticleService;

  @Controller.Inject(Media)
  private readonly service: Media;

  public async main(
    @Media.One media: BlogMediaEntity,
    @Controller.Store store: Map<any, any>,
  ) {
    await this.media.del(media);
    await this.tag.del();

    if (media.media_type === 'article') {
      const article = await this.article.getOne();
      if (!article) throw new Exception(804, '文章不存在');
      await this.article.del();
    }

    await this.service.executeDeletion(media.media_type, media, store);

    // 未完成
    return Response.json(Date.now());
  }
}