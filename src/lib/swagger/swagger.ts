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

import { createClassDecorator, hook } from "@zille/http-controller";
import { SchemaBase } from "../schema/base";
import { Schema } from "../schema/schema.lib";
import { Group } from "./group";
import { Path } from './path';
import { SwaggerProps, SwaggerSpec } from "./types";
import { HTTPMethod } from 'find-my-way';

export class Swagger extends Group {
  constructor(private readonly meta: SwaggerProps) {
    super();
  }

  public toJSON(): SwaggerSpec {
    return {
      ...this.meta,
      tags: this.getTags(),
      paths: this.getPaths(),
      definitions: this.getDefinitions(),
    }
  }

  static readonly namespace = Symbol('SWAGGER');
  static readonly Definition = createClassDecorator<[Group, (path: Path) => unknown]>(Swagger.namespace, (target, group, fn) => {
    const mount = (method: HTTPMethod, url: string) => {
      const [path] = group.createPath(method, url);
      fn(path);
    }
    hook.onCreate(target, ({ physicalPath, methods }) => {
      const url = physicalPath.replace(/\[([^\]]+)\]/g, '{$1}');
      methods.forEach(method => mount(method, url));
    })
  });
}

export const swagger = new Swagger({
  swagger: '2.0',
  basePath: '/',
  info: {
    title: 'PJBlog Geek API',
    version: '2.0.0',
    description: 'PJBlog since 2014-preset, new Blog for writer',
  },
  schemes: ['http'],
})

const [Global] = swagger.createGroup('Global', '全局接口');
const [WebPage] = swagger.createGroup('WebPage', '主题页面');
const [User] = swagger.createGroup('User', '用户或者登录相关');
const [Category] = swagger.createGroup('Category', '分类相关');
const [Media] = swagger.createGroup('Media', '媒体相关');
const [Page] = swagger.createGroup('Page', '单页相关');
const [Article] = swagger.createGroup('Article', '文章相关');
const [Comment] = swagger.createGroup('Comment', '评论相关');
const [Attachment] = swagger.createGroup('Attachment', '附件相关');

export const SwaggerWithGlobal = Global;
export const SwaggerWithUser = User;
export const SwaggerWithCategory = Category;
export const SwaggerWithMedia = Media;
export const SwaggerWithPage = Page;
export const SwaggerWithArticle = Article;
export const SwaggerWithComment = Comment;
export const SwaggerWithWebPage = WebPage;
export const SwaggerWithAttachment = Attachment;

export function createApiSchema<T extends SchemaBase>(data: T) {
  return new Schema.Object()
    .description('返回数据格式')
    .set('status', new Schema.Number().description('请求状态码').required())
    .set('data', data)
    .set('message', new Schema.String().description('错误内容'))
}