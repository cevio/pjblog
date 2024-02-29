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

export function TransformStringToNumber(defaultValue: number = 0) {
  return (val?: string) => {
    val = val ?? defaultValue.toString();
    return Number(val);
  }
}