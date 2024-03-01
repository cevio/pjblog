import { Media_Types } from "../lib/media.lib";
import { Schema } from "../lib/schema/schema.lib";

export const MediaSchema = () => new Schema.Object()
  .description('媒体缓存数据')
  .set('id', new Schema.Number().description('ID').required())
  .set('media_title', new Schema.String().description('标题').required())
  .set('media_category', new Schema.Number().description('分类').required())
  .set('media_description', new Schema.String().description('描述').required())
  .set('media_user_id', new Schema.Number().description('发布者').required())
  .set('media_token', new Schema.String().description('token').required())
  .set('media_read_count', new Schema.Number().description('阅读量').required())
  .set('media_type', new Schema.String().description('类型').required().enum(...Array.from(Media_Types.values())))
  .set('commentable', new Schema.Bool().description('是否可以评论').required())
  .set('gmt_create', new Schema.String().description('创建时间').required())
  .set('gmt_modified', new Schema.String().description('修改时间').required())