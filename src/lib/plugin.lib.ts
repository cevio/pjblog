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

export abstract class Plugin extends Component {
  public abstract readonly cwd: string;
  public abstract readonly code: string;
  public abstract readonly version: string;
  public abstract readonly name: string;
  public abstract readonly description: string;
  public abstract readonly readme: string;
  public initialize() { }
  public terminate() { }
}
