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

import { SchemaBase } from "../schema/base";
import { SwaggerResponse } from "./types";

export class Response {
  private _schema: SchemaBase;
  constructor(
    public readonly status: number,
    private readonly description?: string,
  ) { }

  public schema(_: SchemaBase) {
    this._schema = _;
    return this;
  }

  public toJSON(): SwaggerResponse {
    return {
      description: this.description,
      schema: this._schema?.toJSON(),
    }
  }
}