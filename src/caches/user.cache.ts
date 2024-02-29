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
import { Meta } from '@zille/service';
import { UserService } from "../services/user.service";
import { Exception } from "../lib/exception";
import { BlogUserEntity } from "../entities/user.entity";
import { ExtractParamsFromString } from "../global.types";

const path = '/user/[account:string]';

@Cache.Injectable()
export class UserCache extends Cache<typeof path, [], BlogUserEntity> {
  @Cache.Inject(UserService)
  private readonly service: UserService;

  constructor(meta: Meta) {
    super(path, meta);
  }

  public async execute(params: ExtractParamsFromString<typeof path>) {
    const user = await this.service.getOneByAccount(params.account);
    if (!user) throw new Exception(404, '用户不存在');
    return {
      value: user,
    }
  }
}