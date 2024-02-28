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

export abstract class Cacheable {
  public abstract set<T = any>(key: string, value: T, seconds?: number): Promise<T>;
  public abstract get<T = any>(key: string): Promise<T>;
  public abstract del(key: string): Promise<boolean>;
  public abstract expire(key: string, ms: number): Promise<boolean>;
  public abstract close(): void;
  public abstract has(key: string): Promise<boolean>;
  public abstract ttl(key: string): Promise<number>;
  public abstract exists(key: string): Promise<number>;
}
