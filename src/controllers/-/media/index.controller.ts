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
import { JSONErrorCatch } from "../../../middlewares/catch.mdw";
import { DataBaseMiddleware } from "../../../middlewares/database.mdw";
import { UserAdminableMiddleware } from "../../../middlewares/user.mdw";
import { Swagger, SwaggerWithMedia, createApiSchema } from "../../../lib/swagger/swagger";
import { Schema } from "../../../lib/schema/schema.lib";
import { MediaSchema } from "../../../schemas/media.schema";
import { TransformStringToNumber } from "../../../utils";
import { MediaService } from "../../../services/media.service";

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, DataBaseMiddleware(), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithMedia, path => {
  path
    .summary('获取媒体列表')
    .description('获取媒体列表')
    .produces('application/json');

  path.addParameter('page', '页码').In('query').required().schema(new Schema.Number(1));
  path.addParameter('size', '每页数').In('query').required().schema(new Schema.Number(10));
  path.addParameter('category', '分类 ID').In('query').schema(new Schema.Number());
  path.addParameter('type', '类型').In('query').schema(new Schema.String());
  path.addResponse(200, '请求成功').schema(
    createApiSchema(
      new Schema.Array().items(MediaSchema)
    )
  );
})
export default class extends Controller {
  @Controller.Inject(MediaService)
  private readonly media: MediaService;

  public async main(
    @Controller.Query('page', TransformStringToNumber(1)) page: number,
    @Controller.Query('page', TransformStringToNumber(10)) size: number,
    @Controller.Query('category', Number) category: number,
    @Controller.Query('type') type: string,
  ) {
    const [dataSource, total] = await this.media.getManyByType(page, size, { type, category });
    return Response.json(dataSource)
      .set('x-page', page)
      .set('x-size', size)
      .set('x-total', total);
  }
}