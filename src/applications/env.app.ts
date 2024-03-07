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
import dayjs from 'dayjs';
import fsextra from 'fs-extra';
import { Configurator } from '@zille/configurator';
import { Application } from '@zille/application';
import { TypeORM } from '@zille/typeorm';
import { createRequire } from 'node:module';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BlogDataBaseProps } from '../global.types';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);
const { ensureDir } = fsextra;

@Application.Injectable()
export class Env extends Application {
  @Application.Inject(Configurator)
  private readonly Configs: Configurator;
  public readonly cwd = process.cwd();
  public readonly version: string = require(resolve(__dirname, '../../package.json')).version;
  public setup() { }

  public toPath(path: string) {
    const props = this.Configs.get<BlogDataBaseProps>(TypeORM.namespace);
    return `${props.entityPrefix || 'blog'}:${path}`;
  }

  public async getCurrentAttachmentDirectory() {
    const dictionary = resolve(this.cwd, 'attachments', dayjs().format('YYYY-MM-DD'));
    await ensureDir(dictionary);
    return dictionary;
  }

  public getAttachmentRelativePath(absPath: string) {
    const source = resolve(this.cwd, 'attachments');
    return relative(source, absPath);
  }

  public getAttachmentAbsolutePath(relativePath: string) {
    const source = resolve(this.cwd, 'attachments');
    return resolve(source, relativePath);
  }
}