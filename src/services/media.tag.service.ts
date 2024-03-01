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
import { BlogMediaTagEntity } from "../entities/media.tag.entity";
import { diff } from "../utils";
import { Media } from "../applications/media.app";

@Service.Injectable()
export class MediaTagService extends Service {
  @Service.InjectStore(DataBaseConnnectionNameSpace)
  private readonly conn: DataBaseConnection;

  @Service.InjectStore(Media.Middleware_Store_NameSpace)
  private readonly media: BlogMediaEntity;

  private getRepository() {
    return this.conn.manager.getRepository(BlogMediaTagEntity);
  }

  public save(target: BlogMediaTagEntity) {
    return this.getRepository().save(target);
  }

  public del() {
    return this.getRepository().delete({
      media_id: this.media.id,
    })
  }

  public getMany() {
    return this.getRepository().findBy({
      media_id: this.media.id
    });
  }

  public async update(...tags: string[]) {
    const oldTags = await this.getMany();
    const tagMaps = new Map<string, BlogMediaTagEntity>();
    const oldtagNames = oldTags.map(tag => {
      tagMaps.set(tag.tag_name, tag);
      return tag.tag_name;
    });

    const { adds, removes } = diff(oldtagNames, tags);

    for (let i = 0; i < adds.length; i++) {
      const name = adds[i];
      await this.save(this.getRepository().create().add(name, this.media.id));
    }

    for (let i = 0; i < removes.length; i++) {
      const name = removes[i];
      const tag = tagMaps.get(name);
      await this.getRepository().delete({ id: tag.id });
    }
  }

  public async relatives(size: number) {
    const tags = await this.getMany();
    const tnames = tags.map(tag => tag.tag_name);
    if (!tnames.length) return [];
    const sql = this.getRepository().createQueryBuilder('t');
    sql.leftJoin(BlogMediaEntity, 'm', 'm.id=t.media_id');
    sql.where('t.tag_name IN (:...names)', { names: tnames });
    sql.andWhere('m.id<>:mid', { mid: this.media.id });
    sql.andWhere('m.media_type=:type', { type: this.media.media_type })
    sql.orderBy({
      'm.gmt_create': 'DESC'
    })
    sql.select('m.media_title', 'title');
    sql.addSelect('m.media_token', 'token');
    sql.addSelect('m.media_read_count', 'count');
    sql.addSelect('m.media_type', 'type');
    sql.limit(size);
    const res = await sql.getRawMany<Record<'title' | 'token' | 'count' | 'type', string>>();
    return res.map(r => {
      return {
        title: r.title,
        token: r.token,
        count: Number(r.count),
        type: Number(r.type)
      }
    })
  }
}