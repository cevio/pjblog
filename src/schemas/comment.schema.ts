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

export const CommentSchema = new Schema.Object()
  .description('查看评论数据')
  .set('id', new Schema.Number().description('评论 id'))
  .set('content', new Schema.String().description('评论内容'))
  .set('gmtc', new Schema.String().description('创建时间'))
  .set('gmtm', new Schema.String().description('修改时间'))
  .set('user',
    new Schema.Object()
      .description('发布者信息')
      .set('nickname', new Schema.String().description('昵称'))
      .set('avatar', new Schema.String().description('头像'))
  )
