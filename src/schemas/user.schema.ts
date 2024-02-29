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

export const UserSchema = new Schema.Object()
  .set('id', new Schema.Number().description('主键').required())
  .set('account', new Schema.String().description('用户登入账号，在同一种登录类型下必须唯一').required())
  .set('nickname', new Schema.String().description('昵称').required())
  .set('email', new Schema.String().description('邮箱').required())
  .set('avatar', new Schema.String().description('头像').required())
  .set('password', new Schema.String().description('密码').required())
  .set('salt', new Schema.String().description('盐').required())
  .set('website', new Schema.String().description('个人网站').required())
  .set('forbiden', new Schema.Bool().description('是否禁止登录').required())
  .set('admin', new Schema.Bool().description('管理员').required())
  .set('thirdpart', new Schema.Bool().description('是否为第三方登录').required())
  .set('thirdpart_node_module', new Schema.String().description('第三方登录的模块名称').required())
  .set('gmt_create', new Schema.Number().description('创建时间').required())
  .set('gmt_modified', new Schema.Number().description('更新时间').required());