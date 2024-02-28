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

export class ReferenceSchema extends SchemaBase<string> {
  constructor(v: string) {
    SchemaBase
    super(v);
  }
  public toJSON(): ISchema {
    return {
      $ref: this._default,
    }
  }
}