import { Controller, Response } from "@zille/http-controller";
import { JSONErrorCatch } from "../../../middlewares/catch.mdw";
import { DataBaseMiddleware } from "../../../middlewares/database.mdw";
import { UserAdminableMiddleware } from "../../../middlewares/user.mdw";
import { Swagger, SwaggerWithAttachment, createApiSchema } from "../../../lib/swagger/swagger";
import { Schema } from "../../../lib/schema/schema.lib";
import { AttachmentSchema } from "../../../schemas/attachment.schema";
import { TransformStringToNumber } from "../../../utils";
import { AttachmentService } from "../../../services/attachment.service";

@Controller.Injectable()
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, DataBaseMiddleware(), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithAttachment, path => {
  path
    .summary('附件列表')
    .description('附件列表')
    .produces('application/json')

  path.addParameter('page', '页码').In('query').required().schema(new Schema.Number(1)).required();
  path.addParameter('size', '分页大小').In('query').required().schema(new Schema.Number(10)).required();
  path.addParameter('type', '类型').In('query').required().schema(new Schema.String()).required();
  path.addResponse(200, '请求成功').schema(createApiSchema(
    new Schema.Array().items(AttachmentSchema)
  ));
})
export class GetAttachmentsController extends Controller {
  @Controller.Inject(AttachmentService)
  private readonly service: AttachmentService;

  public async main(
    @Controller.Query('page', TransformStringToNumber(1)) page: number,
    @Controller.Query('size', TransformStringToNumber(10)) size: number,
    @Controller.Query('type') type: string,
  ) {
    const [dataSource, total] = await this.service.getMany(page, size, type);
    return Response.json(dataSource)
      .set('x-page', page)
      .set('x-size', size)
      .set('x-total', total);
  }
}