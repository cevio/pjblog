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
import { FindOptionsWhere, Not, Equal, LessThan, MoreThan } from "typeorm";
import { BlogMediaCommentEntity } from "../entities/media.comment.entity";
import { BlogUserEntity } from "../entities/user.entity";

interface LatestCommentRaw {
  id: string,
  content: string,
  token: string,
  type: string,
  avatar: string,
  nickname: string,
  gmtc: string,
}

@Service.Injectable()
export class MediaService extends Service {
  @Service.Inject(DataBaseConnnectionNameSpace)
  private readonly conn: DataBaseConnection;

  private getRepository() {
    return this.conn.manager.getRepository(BlogMediaEntity);
  }

  private getCommentRepository() {
    return this.conn.manager.getRepository(BlogMediaCommentEntity);
  }

  public save(target: BlogMediaEntity) {
    return this.getRepository().save(target);
  }

  public add(title: string, category: number, description: string, uid: number, type: string) {
    return this.save(this.getRepository().create().add({
      title, category, description, uid, type,
    }))
  }

  public getOneById(id: number) {
    return this.getRepository().findOneBy({ id })
  }

  public getOneByToken(token: string) {
    return this.getRepository().findOneBy({ media_token: token })
  }

  public del(media: BlogMediaEntity) {
    return this.getRepository().remove(media);
  }

  public total() {
    return this.getRepository().count();
  }

  public async readCount() {
    const rows = await this.getRepository().createQueryBuilder('m')
      .select('SUM(m.media_read_count)', "count")
      .getRawMany<{ count: number }>();
    return rows.reduce((prev, next) => prev + Number(next.count), 0);
  }

  public increaseReadCount(media: BlogMediaEntity, value: number) {
    return this.save(media.updateCount(media.media_read_count + value));
  }

  public async latest(size: number, type?: string) {
    const where: FindOptionsWhere<BlogMediaEntity> = {};
    if (type) {
      where.media_type = type;
    } else {
      where.media_type = Not(Equal(type));
    }
    const medias = await this.getRepository().find({
      where,
      order: {
        gmt_create: 'DESC',
      },
      take: size,
    })

    return medias.map(media => {
      return {
        token: media.media_token,
        type: media.media_type,
        title: media.media_title,
        gmtc: media.gmt_create,
      }
    })
  }

  public async hot(size: number, type?: string) {
    const where: FindOptionsWhere<BlogMediaEntity> = {};
    if (type) {
      where.media_type = type;
    } else {
      where.media_type = Not(Equal(type));
    }
    const medias = await this.getRepository().find({
      where,
      order: {
        media_read_count: 'DESC',
        gmt_create: 'DESC',
      },
      take: size,
    })

    return medias.map(media => {
      return {
        token: media.media_token,
        type: media.media_type,
        title: media.media_title,
        gmtc: media.gmt_create,
      }
    })
  }

  private getPrevOne(date: Date, type: string = null) {
    const where: FindOptionsWhere<BlogMediaEntity> = {};
    if (type !== null) {
      where.media_type = type;
    }
    return this.getRepository().findOne({
      where: {
        ...where,
        gmt_create: LessThan(date)
      },
      order: {
        gmt_create: 'DESC'
      }
    })
  }

  private getNextOne(date: Date, type: string = null) {
    const where: FindOptionsWhere<BlogMediaEntity> = {};
    if (type !== null) {
      where.media_type = type;
    }
    return this.getRepository().findOne({
      where: {
        ...where,
        gmt_create: MoreThan(date)
      },
      order: {
        gmt_create: 'ASC'
      }
    })
  }

  public async prevAndNext(date: Date, type?: string) {
    const [prev, next] = await Promise.all([
      this.getPrevOne(date, type),
      this.getNextOne(date, type),
    ])
    return {
      prev, next,
    }
  }

  public async getManyByType(page: number, size: number, options: {
    type?: string,
    category?: number,
  } = {}) {
    const conditions: FindOptionsWhere<BlogMediaEntity> = {};

    if (typeof options.type === 'string') {
      conditions.media_type = options.type;
    }

    if (typeof options.category === 'number' && options.category > 0) {
      conditions.media_category = options.category;
    }

    return this.getRepository().findAndCount({
      where: conditions,
      skip: (page - 1) * size,
      take: size,
      order: {
        gmt_create: 'DESC',
      }
    })
  }

  public async latestComments(size: number) {
    const sql = this.getCommentRepository().createQueryBuilder('c');
    sql.leftJoin(BlogMediaEntity, 'm', 'm.id=c.media_id');
    sql.leftJoin(BlogUserEntity, 'u', 'u.id=c.user_id');
    sql.orderBy({
      'c.gmt_create': 'DESC',
    })
    sql.limit(size);
    sql.select('c.id', 'id');
    sql.addSelect('c.content', 'content');
    sql.addSelect('c.gmt_create', 'gmtc');
    sql.addSelect('m.media_token', 'token');
    sql.addSelect('m.media_type', 'type');
    sql.addSelect('u.avatar', 'avatar');
    sql.addSelect('u.nickname', 'nickname');
    const comments = await sql.getRawMany<LatestCommentRaw>();
    return comments.map(comment => {
      return {
        id: Number(comment.id),
        content: comment.content,
        gmtc: comment.gmtc,
        token: comment.token,
        type: Number(comment.type),
        user: {
          avatar: comment.avatar,
          nickname: comment.nickname,
        }
      }
    })
  }
}