import { Controller, Response } from "@zille/http-controller";
import { JSONErrorCatch } from "../../../../middlewares/catch.mdw";
import { HttpBodyMiddleware } from "../../../../middlewares/http.body.mdw";
import { DataBaseMiddleware } from "../../../../middlewares/database.mdw";
import { Me, UserAdminableMiddleware } from "../../../../middlewares/user.mdw";
import { BlogUserEntity } from "../../../../entities/user.entity";
import { TransformStringToNumber } from "../../../../utils";
import { UserService } from "../../../../services/user.service";
import { Exception } from "../../../../lib/exception";
import { UserCache } from "../../../../caches/user.cache";
import { Swagger, SwaggerWithUser, createApiSchema } from "../../../../lib/swagger/swagger";
import { Schema } from "../../../../lib/schema/schema.lib";

@Controller.Injectable()
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithUser, path => {
  path
    .summary('用户禁止登录状态变更')
    .description('将此用户的禁止登录状态变更')
    .consumes('application/json', 'application/x-www-form-urlencoded')
    .produces('application/json');

  path.addParameter('id', '用户 id').In('path').required().schema(new Schema.Number()).required();
  path.addParameter('value', '值').In('formData').required().schema(new Schema.Bool()).required();
  path.addResponse(200, '请求成功').schema(createApiSchema(new Schema.Number().description('时间戳')));
})
export default class extends Controller<'id'> {
  @Controller.Inject(UserService)
  private readonly user: UserService;

  @Controller.Inject(UserCache)
  private readonly cache: UserCache;

  public async main(
    @Me me: BlogUserEntity,
    @Controller.Param('id', TransformStringToNumber()) id: number,
    @Controller.Body body: {
      value: boolean,
    }
  ) {
    let user = await this.user.getOneById(id);
    if (!user) throw new Exception(404, '用户不存在');
    if (user.id === me.id) throw new Exception(411, '用户操作被禁止');
    user = await this.user.save(user.updateForbiden(body.value));
    await this.cache.write({ account: user.account });
    return Response.json(Date.now())
  }
}