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

import { Service, Meta } from '@zille/service';
import { Storage } from '../applications/cache/cache.app';
import { compile, PathFunction } from 'path-to-regexp';
import { Env } from '../applications/env.app';
import { ExtractParamsFromString } from '../global.types';

export type CacheResult<R> = {
  value: R,
  expire?: number,
}

export abstract class Cache<T extends string, P extends any[], R> extends Service {
  @Service.Inject(Storage)
  private readonly Storage: Storage;

  @Service.Inject(Env)
  public readonly Env: Env;

  private readonly toPath: PathFunction<Partial<ExtractParamsFromString<T>>>;
  public abstract execute(params: ExtractParamsFromString<T>, ...args: P): CacheResult<R> | Promise<CacheResult<R>>;

  constructor(path: T, meta: Meta, store?: Map<any, any>) {
    super(meta, store);
    this.toPath = compile(path.replace(/\[([^\:]+)[^\]]+\]/g, ':$1'));
  }

  private makePath(params?: ExtractParamsFromString<T>) {
    let key = this.toPath(params || {});
    if (key.startsWith('/')) key = key.substring(1);
    return this.Env.toPath(key.replace(/\//g, ':'));
  }

  public async write(params?: ExtractParamsFromString<T>, ...args: P) {
    const { value, expire } = await Promise.resolve(this.execute(params, ...args));
    const key = this.makePath(params);
    await this.Storage.connection.set(key, value, expire);
    return value;
  }

  public async read(params?: ExtractParamsFromString<T>, ...args: P) {
    const key = this.makePath(params);
    if (await this.Storage.connection.exists(key)) {
      return await this.Storage.connection.get<R>(key);
    } else {
      return await this.write(params, ...args);
    }
  }

  public async remove(params?: ExtractParamsFromString<T>) {
    const key = this.makePath(params);
    if (await this.Storage.connection.exists(key)) {
      return await this.Storage.connection.del(key);
    }
  }
}
