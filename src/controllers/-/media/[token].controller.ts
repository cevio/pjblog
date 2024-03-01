import { Controller, Response } from "@zille/http-controller";
import { JSONErrorCatch } from "../../../middlewares/catch.mdw";
import { DataBaseMiddleware } from "../../../middlewares/database.mdw";
import { UserAdminableMiddleware } from "../../../middlewares/user.mdw";
import { Swagger, SwaggerWithMedia, createApiSchema } from "../../../lib/swagger/swagger";
import { Schema } from "../../../lib/schema/schema.lib";
import { Media_Types } from "../../../lib/media.lib";
import { MediaSchema } from "../../../schemas/media.schema";
import { MediaService } from "../../../services/media.service";

@Controller.Injectable()
@Controller.Method('DELETE')
@Controller.Middleware(JSONErrorCatch, DataBaseMiddleware(), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithMedia, path => {
  path
    .summary('获取媒体列表')
    .description('获取媒体列表')
    .produces('application/json');

  path.addParameter('page', '页码').In('query').required().schema(new Schema.Number(1));
  path.addParameter('size', '每页数').In('query').required().schema(new Schema.Number(10));
  path.addParameter('category', '分类 ID').In('query').schema(new Schema.Number());
  path.addParameter('type', '类型').In('query').schema(new Schema.String().enum(...Array.from(Media_Types.values())));
  path.addResponse(200, '请求成功').schema(
    createApiSchema(
      new Schema.Array().items(MediaSchema())
    )
  );
})
export default class extends Controller<'token'> {
  @Controller.Inject(MediaService)
  private readonly media: MediaService;

  public async main() {
    // 未完成
    return Response.json(Date.now());
  }
}