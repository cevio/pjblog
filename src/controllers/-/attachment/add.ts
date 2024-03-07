import createFileMD5 from 'md5-file';
import fsextra from 'fs-extra';

import { Controller, Response } from "@zille/http-controller";
import { JSONErrorCatch } from "../../../middlewares/catch.mdw";
import { HttpBodyMiddleware } from "../../../middlewares/http.body.mdw";
import { DataBaseConnnectionRollbackNameSpace, DataBaseMiddleware } from "../../../middlewares/database.mdw";
import { UserAdminableMiddleware } from "../../../middlewares/user.mdw";
import { Swagger, SwaggerWithAttachment, createApiSchema } from "../../../lib/swagger/swagger";
import { Schema } from "../../../lib/schema/schema.lib";
import { AttachmentSchema } from "../../../schemas/attachment.schema";
import { Files } from 'formidable';
import { Env } from "../../../applications/env.app";
import { AttachmentyService } from "../../../services/attachment.service";
import { BlogAttachmentEntity } from "../../../entities/attachment.entity";
import { statSync, existsSync } from 'node:fs';
import { extname, resolve } from 'node:path';

const { moveSync, unlinkSync } = fsextra;

@Controller.Injectable()
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyMiddleware, DataBaseMiddleware(true), UserAdminableMiddleware)
@Swagger.Definition(SwaggerWithAttachment, path => {
  path
    .summary('上传附件')
    .description('上传附件')
    .consumes('multipart/form-data')
    .produces('application/json')

  path.addParameter('body', '附件').In('formData').schema(new Schema.File())
  path.addResponse(200, '请求成功').schema(createApiSchema(
    new Schema.Array().items(AttachmentSchema)
  ));
})
export class AddAttachmentController extends Controller {
  @Controller.Inject(Env)
  private readonly env: Env;

  @Controller.Inject(AttachmentyService)
  private readonly service: AttachmentyService;

  @Controller.Inject(DataBaseConnnectionRollbackNameSpace)
  private readonly rollback: (roll: () => unknown) => number;

  public async main(
    @Controller.Files files: Files
  ) {
    const dictionary = await this.env.getCurrentAttachmentDirectory();
    const entities: BlogAttachmentEntity[] = [];
    for (const key in files) {
      const file = files[key];
      const _files = Array.isArray(file) ? file : [file];
      for (let i = 0; i < _files.length; i++) {
        const chunk = _files[i];
        const stat = statSync(chunk.filepath);
        if (stat.isFile()) {
          const md5 = await createFileMD5(chunk.filepath);
          const fileextname = extname(chunk.originalFilename);
          const targetFilename = resolve(dictionary, md5 + fileextname);
          const exists = existsSync(targetFilename);
          moveSync(chunk.filepath, targetFilename, { overwrite: true });
          this.rollback(() => {
            if (!exists) {
              unlinkSync(targetFilename);
            }
          })
          const relative = await this.env.getAttachmentRelativePath(targetFilename);
          let target = await this.service.getOneByMd5(md5);
          const args = [relative, stat.size, chunk.mimetype, md5] as const;
          if (!target) {
            target = await this.service.add(...args);
          }
          entities.push(target);
        }
      }
    }
    return Response.json(entities);
  }
}