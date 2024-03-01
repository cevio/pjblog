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
import { BlogMediaCommentEntity } from "../entities/media.comment.entity";
import { BlogUserEntity } from "../entities/user.entity";
import { Media } from "../applications/media.app";

interface RawComment {
  id: number,
  uid: number,
  nickname: string,
  avatar: string,
  content: string,
  gmtc: string | Date,
  gmtm: string | Date,
}

interface RowComment {
  id: number,
  content: string,
  gmtc: string | Date,
  gmtm: string | Date,
  user: {
    nickname: string,
    avatar: string,
  }
}

@Service.Injectable()
export class MediaCommentService extends Service {
  @Service.InjectStore(DataBaseConnnectionNameSpace)
  private readonly conn: DataBaseConnection;

  @Service.InjectStore(Media.Middleware_Store_NameSpace)
  private readonly media: BlogMediaEntity;

  private getRepository() {
    return this.conn.manager.getRepository(BlogMediaCommentEntity);
  }

  public save(target: BlogMediaCommentEntity) {
    return this.getRepository().save(target);
  }

  public add(user: number, content: string, parent: number = 0) {
    return this.save(this.getRepository().create().add(this.media.id, user, content))
  }

  public del() {
    return this.getRepository().delete({
      media_id: this.media.id,
    })
  }

  public getOneById(id: number) {
    return this.getRepository().findOneBy({
      media_id: this.media.id, id,
    })
  }

  public delOneById(id: number) {
    return this.getRepository().delete({
      media_id: this.media.id,
      id,
    })
  }

  public delOne(comment: BlogMediaCommentEntity) {
    return this.getRepository().remove(comment);
  }

  public async getMany(page: number, size: number, parent_id: number = 0) {
    const sql = this.getRepository().createQueryBuilder('c');
    sql.leftJoin(BlogUserEntity, 'u', 'u.id=c.user_id');
    sql.where('c.media_id=:media_id', { media_id: this.media.id });
    sql.andWhere('c.parent_id=:parent_id', { parent_id });

    const count = await sql.clone().getCount();

    sql.select('c.id', 'id');
    sql.addSelect('u.nickname', 'nickname');
    sql.addSelect('u.avatar', 'avatar');
    sql.addSelect('c.content', 'content');
    sql.addSelect('c.gmt_create', 'gmtc');
    sql.addSelect('c.gmt_modified', 'gmtm');

    sql.orderBy('c.gmt_create', 'DESC');
    sql.offset((page - 1) * size);
    sql.limit(size);

    const data = await sql.getRawMany<RawComment>();
    const rows = data.map<RowComment>(raw => ({
      id: raw.id,
      content: raw.content,
      gmtc: raw.gmtc,
      gmtm: raw.gmtm,
      user: {
        nickname: raw.nickname,
        avatar: raw.avatar
      }
    }))

    return [rows, count] as const;
  }
}