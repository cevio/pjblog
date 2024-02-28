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

export class IntegerSchema extends SchemaBase<number> {
  private readonly _enum = new Set<number | { label: string, value: number }>();
  private _minimum: number;
  private _maximum: number;
  private _exclusiveMinimum: boolean;
  private _exclusiveMaximum: boolean;
  private _multipleOf: number;
  private _placeholder: string;

  constructor(defaultValue?: number) {
    super(defaultValue);
  }

  public placeholder(v: string) {
    this._placeholder = v;
    return this;
  }

  public enum(...args: (number | { label: string, value: number })[]) {
    args.forEach(arg => this._enum.add(arg));
    return this;
  }

  public max(i: number, x: boolean = false) {
    this._maximum = i;
    this._exclusiveMaximum = x;
    return this;
  }

  public min(i: number, x: boolean = false) {
    this._minimum = i;
    this._exclusiveMinimum = x;
    return this;
  }

  public multipleOf(i: number) {
    this._multipleOf = i;
    return this;
  }

  public toJSON(): ISchema {
    const _enums = Array.from(this._enum.values());
    const styles: any = {}
    for (const [key, value] of this._styles.entries()) {
      styles[key] = value
    }
    return {
      type: 'integer',
      title: this._title,
      description: this._description,
      default: this._default,
      enum: _enums.length ? _enums.map(item => typeof item === 'number' ? item : item.value) : undefined,
      enumLable: _enums.length ? _enums.map(item => typeof item === 'number' ? item : item.label) : undefined,
      readOnly: this._readOnly ? true : undefined,
      writeOnly: this._writeOnly ? true : undefined,
      maximum: this._maximum,
      minimum: this._minimum,
      exclusiveMaximum: this._exclusiveMaximum,
      exclusiveMinimum: this._exclusiveMinimum,
      multipleOf: this._multipleOf,
      style: styles,
      placeholder: this._placeholder,
    }
  }
}