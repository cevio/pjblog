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

export class FileSchema extends SchemaBase<string> {
  private readonly _enum = new Set<string | { label: string, value: string }>();

  constructor(defaultValue?: string) {
    super(defaultValue);
  }

  public toJSON(): ISchema {
    return {
      type: 'file',
      title: this._title,
      description: this._description,
      readOnly: this._readOnly ? true : undefined,
      writeOnly: this._writeOnly ? true : undefined,
    }
  }
}