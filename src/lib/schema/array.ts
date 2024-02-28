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

export class ArraySchema<T> extends SchemaBase<T[]> {
  public _items: SchemaBase;
  constructor(v: T[] = []) {
    super(v);
  }

  public items<U extends SchemaBase>(schema: U) {
    this._items = schema;
    return this;
  }

  public toJSON(): ISchema {
    return {
      type: 'array',
      title: this._title,
      description: this._description,
      default: this._default,
      readOnly: this._readOnly ? true : undefined,
      writeOnly: this._writeOnly ? true : undefined,
      items: this._items?.toJSON(),
    }
  }
}