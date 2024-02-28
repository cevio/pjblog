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

import fs from 'fs-extra';
import { Configurator } from '@zille/configurator';
import { Component } from '@zille/core';
import { BlogProps } from '../../global.types';
import { resolve } from 'node:path';
import { Env } from '../env.app';
import { Cacheable } from './impl';
import { BlogFileCacheModel } from './file';
import { IORedis } from '@zille/ioredis';
import { BlogRedisCacheModel } from './redis';

const { ensureDir } = fs;

@Component.Injectable()
export class Storage extends Component {
  @Component.Inject(Configurator)
  private readonly Configs: Configurator;

  @Component.Inject(Env)
  private readonly Env: Env;

  public connection: Cacheable;

  static readonly namespace = Symbol('CACHE');
  public async initialize() {
    let target: Cacheable;
    const props = this.Configs.get<BlogProps['cache']>(Storage.namespace);
    switch (props.type) {
      case 'file':
        const _directory = resolve(this.Env.cwd, props.directory || 'cache');
        await ensureDir(_directory);
        target = new BlogFileCacheModel(_directory);
        break;
      case 'redis':
        const redis = await this.use(IORedis);
        target = new BlogRedisCacheModel(redis.connection);
        break;
    }
    if (target) this.connection = target;
  }
  public terminate() {
    if (this.connection) {
      this.connection.close();
    }
  }
}
