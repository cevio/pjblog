/**
 * Copyright (c) PJBlog Platforms, net. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author evio<evio@vip.qq.com>
 * @Website https://www.pjhome.net
 */

'use strict';

import { Service } from "@zille/service";
import { DataBaseConnnectionNameSpace } from "../middlewares/database.mdw";
import { DataBaseConnection } from "../global.types";
import { BlogMediaEntity } from "../entities/media.entity";
import { BlogMediaArticleEntity } from "../entities/media.article.entity";
import { Media } from "../applications/media.app";

@Service.Injectable()
export class MediaArticleService extends Service {
  @Service.InjectStore(DataBaseConnnectionNameSpace)
  private readonly conn: DataBaseConnection;

  @Service.InjectStore(Media.Middleware_Store_NameSpace)
  private readonly media: BlogMediaEntity;

  private getRepository() {
    return this.conn.manager.getRepository(BlogMediaArticleEntity);
  }

  public save(target: BlogMediaArticleEntity) {
    return this.getRepository().save(target);
  }

  public add(markdown: string, source: string[] = []) {
    return this.save(this.getRepository().create().add(this.media.id, markdown, source));
  }

  public del() {
    return this.getRepository().delete({ media_id: this.media.id });
  }

  public getOne() {
    return this.getRepository().findOneBy({ media_id: this.media.id })
  }
}