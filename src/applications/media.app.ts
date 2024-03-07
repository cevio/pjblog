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

import 'koa';
import { Application } from '@zille/application';
import { BlogMediaEntity } from '../entities/media.entity';
import { Controller } from '@zille/http-controller';

declare module 'koa' {
  interface BaseContext {
    media: BlogMediaEntity,
  }
}

@Application.Injectable()
export class Media extends Application {
  public readonly types = new Set<string>(['page', 'article']);
  static readonly Middleware_Store_NameSpace = Symbol('middleware:store');
  public readonly deletions = new Map<string, Set<(media: BlogMediaEntity, store: Map<any, any>) => Promise<unknown>>>();
  public setup() { }

  static readonly One = Controller.Context(ctx => ctx.media);

  public addDeletion(type: string, callback: (media: BlogMediaEntity, store: Map<any, any>) => Promise<unknown>) {
    if (this.types.has(type)) {
      if (!this.deletions.has(type)) {
        this.deletions.set(type, new Set())
      }
      const chunks = this.deletions.get(type);
      chunks.add(callback);
    }
    return this;
  }

  public async executeDeletion(type: string, media: BlogMediaEntity, store: Map<any, any>) {
    if (this.types.has(type) && this.deletions.has(type)) {
      const chunks = this.deletions.get(type);
      await Promise.all(Array.from(chunks.values()).map(fn => fn(media, store)))
    }
    return this;
  }
}