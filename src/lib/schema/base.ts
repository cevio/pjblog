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

import { ISchema } from "./types";

export abstract class SchemaBase<T = any> {
  public _required = false;
  public _title: string;
  public _description: string;
  public _readOnly = false;
  public _writeOnly = false;
  public readonly _styles = new Map<string, any>();

  public abstract toJSON(): ISchema;

  constructor(public readonly _default: T) { }

  public readOnly() {
    this._readOnly = true;
    return this;
  }

  public style(key: string, value: any) {
    this._styles.set(key, value);
    return this;
  }

  public writeOnly() {
    this._writeOnly = true;
    return this;
  }

  public title(v: string) {
    this._title = v;
    return this;
  }

  public description(v: string) {
    this._description = v;
    return this;
  }

  get isRequired() {
    return this._required;
  }

  public required() {
    this._required = true;
    return this;
  }
}