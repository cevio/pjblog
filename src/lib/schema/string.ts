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

export class StringSchema extends SchemaBase<string> {
  private _format: ISchema['format'];
  private _pattern: string;
  private _minLength: number;
  private _maxLength: number;
  private _placeholder: string;
  private _rows = 3;
  private readonly _enum = new Set<string | { label: string, value: string }>();

  constructor(defaultValue?: string) {
    super(defaultValue);
  }

  public format(type: ISchema['format']) {
    this._format = type;
    return this;
  }

  public placeholder(v: string) {
    this._placeholder = v;
    return this;
  }

  public enum(...args: (string | { label: string, value: string })[]) {
    args.forEach(arg => this._enum.add(arg));
    return this;
  }

  public pattern(v: string) {
    this._pattern = v;
    return this;
  }

  public max(i: number) {
    this._maxLength = i;
    return this;
  }

  public min(i: number) {
    this._minLength = i;
    return this;
  }

  public rows(i: number = 3) {
    if (this._format !== 'textarea') {
      throw new Error('rows must be formatted as textarea');
    }
    this._rows = i;
    return this;
  }

  public toJSON(): ISchema {
    const _enums = Array.from(this._enum.values());
    const styles: any = {}
    for (const [key, value] of this._styles.entries()) {
      styles[key] = value
    }
    return {
      type: 'string',
      format: this._format,
      title: this._title,
      description: this._description,
      default: this._default,
      enum: _enums.length ? _enums.map(item => typeof item === 'string' ? item : item.value) : undefined,
      enumLable: _enums.length ? _enums.map(item => typeof item === 'string' ? item : item.label) : undefined,
      readOnly: this._readOnly ? true : undefined,
      writeOnly: this._writeOnly ? true : undefined,
      pattern: this._pattern,
      maxLength: this._maxLength,
      minLength: this._minLength,
      style: styles,
      placeholder: this._placeholder,
      rows: this._rows,
    }
  }
}