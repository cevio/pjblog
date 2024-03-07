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

import etag from 'koa-etag';
import { Controller, Response } from "@zille/http-controller";
import { NormalErrorCatch } from "../../../../middlewares/catch.mdw";
import { DataBaseMiddleware } from "../../../../middlewares/database.mdw";
import { Swagger, SwaggerWithAttachment } from "../../../../lib/swagger/swagger";
import { Schema } from "../../../../lib/schema/schema.lib";
import { Exception } from "../../../../lib/exception";
import { Env } from "../../../../applications/env.app";
import { createReadStream } from 'node:fs';
import { AttachmentCache } from '../../../../caches/attachment.cache';

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(NormalErrorCatch, DataBaseMiddleware(), etag())
@Swagger.Definition(SwaggerWithAttachment, path => {
  path
    .summary('附件流')
    .description('附件流')

  path.addParameter('id', 'id').In('path').schema(new Schema.Number());
})
export class GetAttachmentController extends Controller<'id'> {
  @Controller.Inject(AttachmentCache)
  private readonly cache: AttachmentCache;

  @Controller.Inject(Env)
  private readonly env: Env;

  public async main(@Controller.Param('id', Number) id: number) {
    const attachment = await this.cache.read({ id });
    if (!attachment) throw new Exception(904, '附件不存在');
    const current = this.env.getAttachmentAbsolutePath(attachment.path);
    return Response.stream(createReadStream(current)).setType(attachment.type);
  }
}