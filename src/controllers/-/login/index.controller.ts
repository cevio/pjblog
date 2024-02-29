import { Controller, Response } from "@zille/http-controller";
import { Logins } from "../../../applications/logins.app";
import { Swagger, SwaggerWithGlobal, createApiSchema } from "../../../lib/swagger/swagger";
import { Schema } from "../../../lib/schema/schema.lib";
import { JSONErrorCatch } from "../../../middlewares/catch.mdw";

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch)
@Swagger.Definition(SwaggerWithGlobal, path => {
  path
    .summary('登录模式列表')
    .description('登录模式列表')
    .produces('application/json');

  path.addResponse(200, '请求成功').schema(createApiSchema(
    new Schema.Array()
      .items(
        new Schema.Object()
          .set('id', new Schema.String())
          .set('name', new Schema.String())
          .set('description', new Schema.String())
          .set('version', new Schema.String())
          .set('icon', new Schema.String())
      )
  ));
})
export default class extends Controller {
  @Controller.Inject(Logins)
  private readonly logins: Logins;
  public async main() {
    return Response.json(this.logins.list());
  }
}