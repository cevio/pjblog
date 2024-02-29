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
import { LoginsProps } from '../global.types';

@Component.Injectable()
export class Logins extends Component {
  private readonly stacks = new Map<string, LoginsProps>();
  public initialize() { }
  public terminate() { }

  public has(id: string) {
    return this.stacks.has(id);
  }

  public get(id: string) {
    return this.stacks.get(id);
  }

  public add(data: LoginsProps) {
    this.stacks.set(data.id, data);
    return this;
  }
  public list() {
    return Array.from(this.stacks.values()).map(login => {
      const { redirect, ...extras } = login;
      return extras;
    });
  }

  public del(id: string) {
    if (this.stacks.has(id)) {
      this.stacks.delete(id);
    }
    return this;
  }
}