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

import { Cacheable } from './impl';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { readdirSync, statSync, renameSync, existsSync, writeFileSync, unlinkSync } from 'node:fs';

const require = createRequire(import.meta.url);

/**
 * 文件缓存类
 */
export class BlogFileCacheModel extends Cacheable {
  private readonly timer: NodeJS.Timeout;
  private readonly stacks = new Map<string, {
    expire: number,
    value: any,
    file: string,
  }>();
  constructor(private readonly dictionary: string) {
    super();
    const files = readdirSync(dictionary);
    files.forEach(file => {
      const exec = this.format(file);
      if (!exec) return;
      const _file = resolve(dictionary, file);
      const stat = statSync(_file);
      if (stat.isFile()) {
        const value = require(_file);
        this.stacks.set(exec.namespace, {
          expire: exec.expire, value,
          file: _file,
        })
      }
    })
    this.timer = setInterval(() => {
      const now = Date.now();
      for (const [key, { expire, file }] of this.stacks.entries()) {
        if (expire === 0) continue;
        if (expire <= now) {
          this.stacks.delete(key);
          unlinkSync(file);
        }
      }
    }, 100)
  }

  private format(file: string) {
    const exec = /^\[(\d+)\]\-(.+)\.json$/.exec(file);
    if (!exec) return;
    const expire = Number(exec[1]);
    const namespace = exec[2];
    return {
      expire,
      namespace,
    }
  }

  /**
   * 创建统一的缓存文件
   * @param key 
   * @returns 
   */
  private createFilePathWithKey(key: string, expire: number = 0) {
    if (key.indexOf('/') > -1) throw new Error('Unsafe key name for file cache');
    return resolve(this.dictionary, '[' + expire + ']-' + key + '.json');
  }

  /**
   * 设置缓存
   * @param key 名称
   * @param value 值
   * @param seconds 有效期 单位:秒
   * @returns 
   */
  public async set<T = any>(key: string, value: T, seconds: number = 0): Promise<T> {
    const expire = seconds === 0 ? 0 : (Date.now() + seconds * 1000);
    const filepath = this.createFilePathWithKey(key, expire);
    if (this.stacks.has(key)) {
      const stack = this.stacks.get(key);
      // 如果周期不一致
      // 1. 更新周期
      // 2. 更新文件名
      if (expire !== stack.expire) {
        renameSync(stack.file, filepath);
        stack.expire = expire;
        stack.file = filepath;
      }
    } else {
      this.stacks.set(key, {
        expire, value,
        file: filepath,
      })
    }
    writeFileSync(filepath, JSON.stringify(value, null, 2), 'utf8');
    return value;
  }

  /**
   * 判断缓存文件是否存在
   * @param key 名称
   * @returns 
   */
  public async exists(key: string): Promise<number> {
    return this.stacks.has(key) ? 1 : 0;
  }

  /**
   * 获取缓存
   * @param key 名称
   * @returns 
   */
  public async get<T = any>(key: string): Promise<T> {
    return this.stacks.has(key) ? this.stacks.get(key).value : null;
  }

  /**
   * 删除缓存
   * @param key 名称
   * @returns 
   */
  public async del(key: string): Promise<boolean> {
    if (!this.stacks.has(key)) return false;
    const file = this.stacks.get(key).file;
    this.stacks.delete(key);
    if (existsSync(file)) {
      unlinkSync(file);
    }
    return true;
  }

  /**
   * 缓存有效期设置
   * @param key 名称
   * @param seconds 有效期 单位:秒
   * @returns 
   */
  public async expire(key: string, seconds: number = 0): Promise<boolean> {
    if (!this.stacks.has(key)) return false;
    const stack = this.stacks.get(key);
    const expire = seconds === 0 ? 0 : (Date.now() + seconds * 1000);
    if (expire !== stack.expire) {
      const filepath = this.createFilePathWithKey(key, expire);
      renameSync(stack.file, filepath);
      stack.expire = expire;
      stack.file = filepath;
    }
    return true;
  }

  /**
   * 判断缓存是否存在
   * @param key 名称
   * @returns 
   */
  public async has(key: string): Promise<boolean> {
    return this.stacks.has(key);
  }

  /**
   * 缓存有效时间获取
   * @param key 名称
   * @returns 
   */
  public async ttl(key: string): Promise<number> {
    if (!this.stacks.has(key)) return -1;
    const { expire } = this.stacks.get(key);
    return Math.floor((expire - Date.now()) / 1000);
  }

  /**
   * 文件缓存服务关闭
   */
  public close() {
    clearInterval(this.timer);
  }
}