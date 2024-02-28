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

import { Redis } from 'ioredis';
import { Cacheable } from './impl';

/**
 * Redis缓存类
 */
export class BlogRedisCacheModel extends Cacheable {
  constructor(
    public readonly redis: Redis,
  ) {
    super();
  }

  /**
   * 判断是否存在缓存
   * @param key 名称
   * @returns 
   */
  public exists(key: string): Promise<number> {
    return this.redis.exists(key);
  }

  /**
   * 设置缓存
   * @param key 名称
   * @param value 值
   * @param seconds 有效期 单位: 秒
   * @returns 
   */
  public async set<T = any>(key: string, value: T, seconds?: number): Promise<T> {
    const buf = JSON.stringify(value);
    if (!seconds) {
      await this.redis.set(key, buf);
    } else {
      await this.redis.setex(key, seconds, buf);
    }
    return value;
  }

  /**
   * 获取缓存
   * @param key 名称
   * @returns 
   */
  public async get<T = any>(key: string): Promise<T> {
    if (!(await this.redis.exists(key))) return;
    return JSON.parse(await this.redis.get(key));
  }

  /**
   * 删除缓存
   * @param key 名称
   * @returns 
   */
  public async del(key: string): Promise<boolean> {
    if (!(await this.redis.exists(key))) return true;
    return !!(await this.redis.del(key));
  }

  /**
   * 设置缓存有效期
   * @param key 名称
   * @param ms 有效期 单位:秒
   * @returns 
   */
  public async expire(key: string, ms: number): Promise<boolean> {
    if (!(await this.redis.exists(key))) return false;
    return !!(await this.redis.expire(key, ms));
  }

  /**
   * 是否具有缓存
   * @param key 名称
   * @returns 
   */
  public async has(key: string): Promise<boolean> {
    return !!(await this.redis.exists(key));
  }

  /**
   * 缓存剩余有效期
   * @param key 名称
   * @returns 
   */
  public async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key);
  }

  /**
   * 关闭服务
   */
  public close() {
    this.redis.disconnect();
  }
}