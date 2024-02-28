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

export class BoolSchema extends SchemaBase {
  private readonly _labels: [string, string] = [null, null];
  constructor(v?: boolean) {
    super(v);
  }

  public labels(v: [string, string]) {
    this._labels[0] = v[0];
    this._labels[1] = v[1];
    return this;
  }

  public toJSON(): ISchema {
    const styles: any = {}
    for (const [key, value] of this._styles.entries()) {
      styles[key] = value
    }
    return {
      type: 'boolean',
      title: this._title,
      description: this._description,
      default: this._default,
      readOnly: this._readOnly ? true : undefined,
      writeOnly: this._writeOnly ? true : undefined,
      style: styles,
      boolabel: this._labels,
    }
  }
}