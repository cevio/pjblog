import { Context, Middleware } from "koa";
import { getService } from "@zille/service";
import { MediaService } from "../services/media.service";
import { Exception } from "../lib/exception";
import { Media } from "../applications/media.app";

export function MediaMiddleware(ider?: (ctx: Context) => string | number): Middleware {
  return async (ctx, next) => {
    const store = ctx.state['SERVICE:STORE'] as Map<any, any>;
    const service = await getService(MediaService, store);
    const id = typeof ider === 'function' ? ider(ctx) : ctx.params.token;
    const media = typeof id === 'number'
      ? await service.getOneById(id)
      : await service.getOneByToken(id);

    if (!media) throw new Exception(804, '媒体不存在');

    store.set(Media.Middleware_Store_NameSpace, ctx.media = media);

    await next();
  }
}