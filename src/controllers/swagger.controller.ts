import SwaggerDataPage from './-/swagger.controller';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { compile } from 'ejs';
import { Controller, Response } from '@zille/http-controller';
import { Swagger, SwaggerWithGlobal } from '../lib/swagger/swagger';
import { Schema } from '../lib/schema/schema.lib';
import { BlogVariable } from '../applications/variable.app';
import { Exception } from '../lib/exception';
import { NormalErrorCatch } from '../middlewares/catch.mdw';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const swaggerFilePath = resolve(__dirname, '../../templates/swagger.ejs');
const tempaltePath = readFileSync(swaggerFilePath, 'utf8');
const render = compile(tempaltePath);

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(NormalErrorCatch)
@Swagger.Definition(SwaggerWithGlobal, path => {
  path
    .summary('Swagger')
    .description('开放 Swagger 内容')
    .produces('application/json')

  path.addResponse(200, '请求成功').schema(new Schema.String());
})
export default class extends Controller {
  @Controller.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  public async main() {
    const allow = this.configs.get('swagger');
    if (!allow) throw new Exception(404, 'Swagger not allowed');
    const url = this.toPath(SwaggerDataPage);
    const template = render({
      title: 'PJBlog Geek API',
      api: url,
    })
    return Response.html(template);
  }
}
