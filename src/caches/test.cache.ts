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

import { Cache, CacheResult } from "../lib/cache.lib";
import { Meta } from '@zille/service';

const g = '/abc/[id:number]/not/[oo:string]';
@Cache.Injectable()
export class abc extends Cache<typeof g, [number], number> {
  constructor(meta: Meta) {
    super(g, meta);
  }
  public execute(params: { id: number; } & { oo: string; }, args_0: number): CacheResult<number> | Promise<CacheResult<number>> {
    return {
      value: 1 + args_0 + params.id,
      expire: 30,
    }
  }
}