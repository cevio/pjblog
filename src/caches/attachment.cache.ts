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

import { Cache } from "../lib/cache.lib";
import { Exception } from "../lib/exception";
import { ExtractParamsFromString } from "../global.types";
import { BlogAttachmentEntity } from "../entities/attachment.entity";
import { AttachmentService } from "../services/attachment.service";

const path = '/attachment/[id:number]';

@Cache.Injectable()
export class AttachmentCache extends Cache<typeof path, [], BlogAttachmentEntity> {
  @Cache.Inject(AttachmentService)
  private readonly service: AttachmentService;

  constructor(ctx: any) {
    super(path, ctx);
  }

  public async execute(params: ExtractParamsFromString<typeof path>) {
    const attachment = await this.service.getOneById(Number(params.id));
    if (!attachment) throw new Exception(904, '附件不存在');
    return {
      value: attachment,
    }
  }
}