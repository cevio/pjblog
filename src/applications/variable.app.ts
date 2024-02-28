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

import { Component } from "@zille/core";
import { Variable } from "../lib/variable.lib";
import { Storage } from "./cache/cache.app";
import { SystemConfigs } from "../global.types";
import { SystemConfigsSchema } from "../schemas/system.configs.schema";

@Component.Injectable()
export class BlogVariable extends Component {
  private variable: Variable<SystemConfigs>;

  @Component.Inject(Storage)
  private readonly cache: Storage;

  public get<U extends keyof SystemConfigs>(key: U): SystemConfigs[U] {
    return this.variable.get(key);
  }

  public set<U extends keyof SystemConfigs>(key: U, value: SystemConfigs[U]) {
    this.variable.set(key, value);
    return this;
  }

  public toSchema() {
    return this.variable.toJSON();
  }

  public toJSON() {
    return this.variable.toJSON()
  }

  public async save(value: Partial<SystemConfigs>) {
    return this.variable.save(value);
  }

  public async update<U extends keyof SystemConfigs>(key: U, value: SystemConfigs[U]) {
    return this.variable.update(key, value);
  }

  public initialize() {
    this.variable = new Variable('system:configs', this.cache.connection, SystemConfigsSchema);
    return this.variable.initialize();
  }

  public terminate() { }
}