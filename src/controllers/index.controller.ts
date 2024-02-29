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

import { Controller, Response } from '@zille/http-controller';
import { JSONErrorCatch } from '../middlewares/catch.mdw';
import { Swagger, SwaggerWithGlobal, createApiSchema } from '../lib/swagger/swagger';
import { Schema } from '../lib/schema/schema.lib';

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch)
@Swagger.Definition(SwaggerWithGlobal, path => {
  path
    .summary('主页')
    .description('主题 - 主页')
    .produces('application/json')

  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.String()));
})
export default class extends Controller {
  public async main() {
    return Response.html('Hello world');
  }
}
