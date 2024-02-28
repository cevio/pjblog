import { Controller, Response } from '@zille/http-controller';
import { Swagger, SwaggerWithGlobal, swagger } from '../../lib/swagger/swagger';
import { Schema } from '../../lib/schema/schema.lib';
import { BlogVariable } from '../../applications/variable.app';
import { Exception } from '../../lib/exception';
import { NormalErrorCatch } from '../../middlewares/catch.mdw';

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(NormalErrorCatch)
@Swagger.Definition(SwaggerWithGlobal, path => {
  path
    .summary('Swagger数据')
    .description('查看 Swagger 内容')
    .produces('application/json')

  path.addResponse(200, '请求成功').schema(new Schema.Object());
})
export default class extends Controller {
  @Controller.Inject(BlogVariable)
  private readonly configs: BlogVariable;
  public async main() {
    const allow = this.configs.get('swagger');
    if (!allow) throw new Exception(404, 'Swagger not allowed');
    return Response.json(swagger.toJSON());
  }
}
