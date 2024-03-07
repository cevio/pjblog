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

// imports
import exitHook from 'async-exit-hook';
import { BlogProps } from './global.types';
import { Application, container } from '@zille/application';
import { Configurator } from '@zille/configurator';
import { TypeORM } from '@zille/typeorm';
import { Http } from '@zille/http';
import { IORedis } from '@zille/ioredis';
import { LoadControllers, Newable } from '@zille/http-controller';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

import { BlogUserEntity } from './entities/user.entity';
import { BlogCategoryEntity } from './entities/category.entity';
import { BlogMediaEntity } from './entities/media.entity';
import { BlogMediaArticleEntity } from './entities/media.article.entity';
import { BlogMediaTagEntity } from './entities/media.tag.entity';
import { BlogAttachmentEntity } from './entities/attachment.entity';
import { BlogMediaCommentEntity } from './entities/media.comment.entity';

import { DataBase } from './applications/database.app';
import { Logger } from './applications/logger.app';
import { Plugin } from './lib/plugin.lib';
import { Storage } from './applications/cache/cache.app';
import { BlogVariable } from './applications/variable.app';

// exports
export * from './applications/database.app';
export * from './applications/env.app';
export * from './applications/logger.app';
export * from './applications/cache/cache.app';

export * from './entities/attachment.entity';
export * from './entities/category.entity';
export * from './entities/media.article.entity';
export * from './entities/media.comment.entity';
export * from './entities/media.entity';
export * from './entities/media.tag.entity';
export * from './entities/user.entity';

export * from './middlewares/catch.mdw';

export * from './lib/plugin.lib';
export * from './lib/cache.lib';
export * from './lib/schema/schema.lib';

export * from './global.types';

// main code
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const controllers = resolve(__dirname, 'controllers');

@Application.Injectable()
class Blog extends Application {

  @Application.Inject(Configurator)
  private readonly Configs: Configurator;

  @Application.Inject(DataBase)
  private readonly DataBase: DataBase;

  @Application.Inject(Logger)
  private readonly Logger: Logger;

  public async initialize(options: BlogProps, plugins: Newable[]) {
    /**
     * plugins setup
     */
    const directories = new Map<string, string>();
    for (let i = 0; i < plugins.length; i++) {
      const plugin = await this.$use(plugins[i]);
      if (plugin.cwd && existsSync(plugin.cwd)) {
        const controller = resolve(plugin.cwd, 'controllers');
        if (existsSync(controller)) {
          directories.set(plugin.code, controller);
        }
      }
    }

    /**
     * Redis setup
     */
    this.Configs.set(Storage.namespace, options.cache);
    this.Configs.set(IORedis.namespace, options.redis);
    await this.$use(Storage);

    /**
     * Database setup
     */
    this.Configs.set(TypeORM.namespace, {
      ...options.database,
      entities: [
        BlogUserEntity,
        BlogCategoryEntity,
        BlogMediaEntity,
        BlogMediaArticleEntity,
        BlogMediaTagEntity,
        BlogAttachmentEntity,
        BlogMediaCommentEntity,
        ...Array.from(this.DataBase.entities.values()),
      ],
      synchronize: true,
      logging: false,
    });
    await this.$use(TypeORM);

    /**
     * 全局变量
     */
    await this.$use(BlogVariable);

    /**
     * Http setup
     */
    this.Configs.set(Http.namespace, options.http);
    const http = await this.$use(Http);
    this.Logger.http('http://127.0.0.1:' + options.http.port);
    await LoadControllers(controllers, http.app);
    this.Logger.debug(`System controllers -> \`${controllers}\``);
    for (const [code, directory] of directories.entries()) {
      await LoadControllers(directory, http.app, {
        prefix: '/-/plugin/' + code,
      })
      this.Logger.debug(`Plugin controllers -> \`${directory}\``);
    }

    this.Logger.info('PJBlog server started.');
  }

  public setup() { }
}

export default (options: BlogProps, plugins: Newable[] = []) => {
  container.connect(Blog).then(blog => {
    exitHook(exit => container.destroy(Blog).finally(exit));
    return blog.initialize(options, plugins);
  }).catch(e => {
    console.error(e);
    container.destroy(Blog).finally(() => process.exit(1));
  });
}