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

import { Configurator } from '@zille/configurator';
import { Component } from '@zille/core';
import { TypeORM } from '@zille/typeorm';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BlogDataBaseProps } from '../global.types';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);

@Component.Injectable()
export class Env extends Component {
  @Component.Inject(Configurator)
  private readonly Configs: Configurator;
  public readonly cwd = process.cwd();
  public readonly version: string = require(resolve(__dirname, '../../package.json')).version;
  public initialize() { }
  public terminate() { }

  public toPath(path: string) {
    const props = this.Configs.get<BlogDataBaseProps>(TypeORM.namespace);
    return `${props.entityPrefix || 'blog'}:${path}`;
  }
}