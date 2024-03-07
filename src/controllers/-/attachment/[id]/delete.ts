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

import fsextra from 'fs-extra';
import { Controller, Response } from "@zille/http-controller";
import { JSONErrorCatch } from "../../../../middlewares/catch.mdw";
import { DataBaseMiddleware } from "../../../../middlewares/database.mdw";
import { UserAdminableMiddleware } from "../../../../middlewares/user.mdw";
import { Swagger, SwaggerWithAttachment, createApiSchema } from "../../../../lib/swagger/swagger";
import { Schema } from "../../../../lib/schema/schema.lib";
import { AttachmentService } from "../../../../services/attachment.service";
import { Exception } from "../../../../lib/exception";
import { Env } from "../../../../applications/env.app";
import { existsSync } from 'node:fs';
import { AttachmentCache } from '../../../../caches/attachment.cache';

const { unlinkSync } = fsextra;

@Controller.Injectable()
@Controller.Method('DELETE')
@Controller.Middleware(JSONErrorCatch, DataBaseMiddleware(true), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithAttachment, path => {
  path
    .summary('删除附件')
    .description('删除附件')
    .produces('application/json')

  path.addParameter('id', 'id').In('path').schema(new Schema.Number())
  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.Number()));
})
export class DeleteAttachmentController extends Controller<'id'> {
  @Controller.Inject(AttachmentService)
  private readonly service: AttachmentService;

  @Controller.Inject(Env)
  private readonly env: Env;

  @Controller.Inject(AttachmentCache)
  private readonly cache: AttachmentCache;

  public async main(@Controller.Param('id', Number) id: number) {
    const attachment = await this.service.getOneById(Number(id));
    if (!attachment) throw new Exception(904, '附件不存在');
    const current = this.env.getAttachmentAbsolutePath(attachment.path);
    await this.service.del(attachment);
    await this.cache.remove({ id: attachment.id });
    if (existsSync(current)) unlinkSync(current);
    return Response.json(Date.now());
  }
}