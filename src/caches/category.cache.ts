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
import { CategoryService } from "../services/category.service";

const path = '/categories';

@Cache.Injectable()
export class CategoryCache extends Cache<typeof path, [], {
  id: number;
  name: string;
  outable: boolean;
  link: string;
}[]> {
  @Cache.Inject(CategoryService)
  private readonly service: CategoryService;

  constructor(ctx: any) {
    super(path, ctx);
  }

  public async execute() {
    const categories = await this.service.getMany();
    const value = categories.sort((a, b) => a.cate_order - b.cate_order).map(category => {
      return {
        id: category.id,
        name: category.cate_name,
        outable: category.cate_outable,
        link: category.cate_outable
          ? category.cate_outlink
          : `/?category=${category.id}`,
      }
    })
    return {
      value,
    }
  }
}