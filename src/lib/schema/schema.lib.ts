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

import { ArraySchema } from "./array";
import { BoolSchema } from "./bool";
import { IntegerSchema } from "./number";
import { ObjectSchema } from "./object";
import { ReferenceSchema } from "./ref";
import { StringSchema } from "./string";
import { FileSchema } from './file';

export * from './types';
export * from './base';

export const Schema = {
  String: StringSchema,
  Integer: IntegerSchema,
  Number: IntegerSchema,
  Bool: BoolSchema,
  Object: ObjectSchema,
  Array: ArraySchema,
  Ref: ReferenceSchema,
  File: FileSchema,
}