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

import { Component } from '@zille/core';

@Component.Injectable()
export class DataBase extends Component {
  public readonly entities = new Set<Function>();
  public initialize() { }
  public terminate() { }
}