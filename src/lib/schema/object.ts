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

import { SchemaBase } from "./base";
import { ISchema } from "./types";

export class ObjectSchema<T> extends SchemaBase<T> {
  public readonly fields = new Map<string, SchemaBase>();
  constructor(v?: T) {
    super(v);
  }

  public set<U extends SchemaBase>(key: string, schema: U) {
    this.fields.set(key, schema);
    return this;
  }

  public toJSON(): ISchema {
    const properties: ISchema['properties'] = {};
    const requireds: string[] = [];

    for (const [key, children] of this.fields.entries()) {
      properties[key] = children.toJSON();
      if (children.isRequired) {
        requireds.push(key);
      }
    }
    return {
      type: 'object',
      title: this._title,
      description: this._description,
      default: this._default,
      readOnly: this._readOnly ? true : undefined,
      writeOnly: this._writeOnly ? true : undefined,
      properties,
      required: requireds,
    }
  }
}