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

import { Schema } from "../lib/schema/schema.lib";

export const CategorySchema = new Schema.Object()
  .description('分类缓存数据')
  .set('id', new Schema.Number().description('ID').required())
  .set('cate_name', new Schema.String().description('分类名').required())
  .set('cate_order', new Schema.Number().description('排序').required())
  .set('cate_outable', new Schema.Bool().description('是否外链').required())
  .set('cate_outlink', new Schema.String().description('外链地址').required())
  .set('gmt_create', new Schema.String().description('创建时间').required())
  .set('gmt_modified', new Schema.String().description('更新时间').required())