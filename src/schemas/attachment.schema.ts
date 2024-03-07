import { Schema } from "../lib/schema/schema.lib";

export const AttachmentSchema = new Schema.Object()
  .description('附件数据')
  .set('id', new Schema.Number().description('id'))
  .set('path', new Schema.String().description('路径'))
  .set('size', new Schema.Number().description('大小'))
  .set('type', new Schema.String().description('类型'))
  .set('md5', new Schema.String().description('md5'))
  .set('gmt_create', new Schema.String().description('创建时间'))
  .set('gmt_modified', new Schema.String().description('更新时间'))