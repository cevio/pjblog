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

import { Service } from '@zille/service';
import { Stream } from 'node:stream';

@Service.Injectable()
export abstract class ArchivePage<T extends object = object> extends Service {
  public abstract state(page: number): T | Promise<T>;
  public abstract render(data: T): string | Stream | Promise<string | Stream>;
}