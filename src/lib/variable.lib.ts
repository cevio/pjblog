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

import { SchemaBase } from "./schema/base";
import { Cacheable } from "../applications/cache/impl";
import { Env } from "../applications/env.app";
import { container } from "@zille/application";

export class Variable<T extends object = any> {
  public readonly state = new Map<keyof T, any>();
  constructor(
    private readonly namespace: string,
    private readonly cache: Cacheable,
    private readonly schema: SchemaBase,
  ) { }

  private async createPathName() {
    const env = await container.connect(Env);
    return env.toPath('variable:' + this.namespace + ':state');
  }

  public async initialize() {
    if (this.schema) {
      const data = this.toSchema();
      const properties = data.properties;
      for (const key in properties) {
        const item = properties[key];
        this.state.set(key as keyof T, item.default);
      }
      const key = await this.createPathName();
      const exists = await this.cache.exists(key);
      if (exists) {
        const json = await this.cache.get(key);
        for (const key of this.state.keys()) {
          if (json[key] !== undefined) {
            this.state.set(key, json[key]);
          }
        }
      }
    }
  }

  public get<U extends keyof T>(key: U): T[U] {
    return this.state.get(key);
  }

  public set<U extends keyof T>(key: U, value: T[U]) {
    this.state.set(key, value);
    return this;
  }

  public toSchema() {
    return this.schema.toJSON();
  }

  public toJSON(): T {
    const data: Partial<Record<keyof T, any>> = {}
    for (const [key, value] of this.state.entries()) {
      data[key] = value;
    }
    return data as T;
  }

  public async save(value: Partial<T>) {
    const key = await this.createPathName();
    for (const key in value) {
      if (this.state.has(key)) {
        this.state.set(key, value[key]);
      }
    }
    return await this.cache.set(key, this.toJSON());
  }

  public async update<U extends keyof T>(key: U, value: T[U]) {
    const keyPath = await this.createPathName();
    if (this.state.has(key)) {
      this.state.set(key, value);
    }
    return await this.cache.set(keyPath, this.toJSON());
  }
}