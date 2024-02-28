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

export class Exception extends Error {
  public readonly status: number;
  public readonly timestamp = Date.now();
  constructor(status: number, msg?: string) {
    super(msg);
    this.status = status;
  }
}