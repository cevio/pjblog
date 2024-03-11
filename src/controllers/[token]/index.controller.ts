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
import { NormalErrorCatch } from '../../middlewares/catch.mdw';
import { Swagger, SwaggerWithWebPage, createApiSchema } from '../../lib/swagger/swagger';
import { Schema } from '../../lib/schema/schema.lib';
import { Themes } from '../../applications/theme.app';
import { TransformStringToNumber } from '../../utils';
import { DataBaseMiddleware } from '../../middlewares/database.mdw';
import { Exception } from '../../lib/exception';
import { DetailPgae } from '../../lib/theme/detail.lib';

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(NormalErrorCatch, DataBaseMiddleware())
@Swagger.Definition(SwaggerWithWebPage, path => {
  path
    .summary('详情页')
    .description('主题 - 详情')
    .produces('application/json')

  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.String()));
})
export default class extends Controller {
  @Controller.Inject(Themes)
  private readonly themes: Themes;

  public async main(
    @Controller.Query('page', TransformStringToNumber(1)) page: number,
    @Controller.Query('token') token: string,
  ) {
    const Theme = this.themes.current;
    if (!Theme.has('detail')) throw new Exception(400, '缺少主题文件');
    const theme = await this.$use(Theme.get('detail') as Newable<DetailPgae>);
    const state = await Promise.resolve(theme.state(page, token));
    return new Response()
      .setData(await Promise.resolve(theme.render(state)))
      .setType('.html')
      .setStatus(200);
  }
}
