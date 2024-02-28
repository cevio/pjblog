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
import { Schema } from '../schema/schema.lib';
import { SwaggerParameter } from "./types";

export class Request {
  private _in: SwaggerParameter['in'];
  private _required = false;
  private _schema: SchemaBase;
  constructor(
    private readonly name: string,
    private readonly description?: string
  ) { }

  public In(pos: SwaggerParameter['in']) {
    this._in = pos;
    return this;
  }

  public required() {
    this._required = true;
    return this;
  }

  public schema(_: SchemaBase) {
    this._schema = _;
    return this;
  }

  public toJSON(): SwaggerParameter {
    const isObjectSchema = this._schema instanceof Schema.Object;
    const isArraySchema = this._schema instanceof Schema.Array;
    const isRefSchema = this._schema instanceof Schema.Ref;
    const schema = this._schema?.toJSON() || {};
    const { required, $ref, ...extra } = schema;
    let _extras = extra;
    if (isObjectSchema || isArraySchema || isRefSchema) {
      // @ts-ignore
      _extras = {};
    }
    return {
      name: this.name,
      description: this.description,
      in: this._in,
      required: this._required,
      ..._extras,
      schema: schema,
    }
  }
}