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

import { Controller, Newable, Response } from '@zille/http-controller';
import { NormalErrorCatch } from '../middlewares/catch.mdw';
import { Swagger, SwaggerWithWebPage, createApiSchema } from '../lib/swagger/swagger';
import { Schema } from '../lib/schema/schema.lib';
import { Themes } from '../applications/theme.app';
import { TransformStringToNumber } from '../utils';
import { DataBaseMiddleware } from '../middlewares/database.mdw';
import { Exception } from '../lib/exception';
import { ArchivePage } from '../lib/theme/archive.lib';

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(NormalErrorCatch, DataBaseMiddleware())
@Swagger.Definition(SwaggerWithWebPage, path => {
  path
    .summary('归档')
    .description('主题 - 归档')
    .produces('application/json')

  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.String()));
})
export default class extends Controller {
  @Controller.Inject(Themes)
  private readonly themes: Themes;

  public async main(@Controller.Query('page', TransformStringToNumber(1)) page: number) {
    const Theme = this.themes.current;
    if (!Theme.has('archive')) throw new Exception(400, '缺少主题文件');
    const theme = await this.$use(Theme.get('archive') as Newable<ArchivePage>);
    const state = await Promise.resolve(theme.state(page));
    return new Response()
      .setData(await Promise.resolve(theme.render(state)))
      .setType('.html')
      .setStatus(200);
  }
}
