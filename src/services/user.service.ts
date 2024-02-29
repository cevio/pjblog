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

import { Service } from '@zille/service';
import { DataBaseConnnectionNameSpace } from '../middlewares/database.mdw';
import { DataBaseConnection } from '../global.types';
import { BlogUserEntity } from '../entities/user.entity';
import { FindOptionsWhere } from 'typeorm';
import { BlogVariable } from '../applications/variable.app';
import { Env } from '../applications/env.app';
import { Storage } from '../applications/cache/cache.app';

@Service.Injectable()
export class UserService extends Service {
  @Service.InjectStore(DataBaseConnnectionNameSpace)
  private readonly conn: DataBaseConnection;

  @Service.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  @Service.Inject(Env)
  private readonly env: Env;

  @Service.Inject(Storage)
  private readonly cache: Storage;

  public createUserLoginTokenKeyPath(token: string) {
    return this.env.toPath('login:token:' + token);
  }

  public createUserAccountLoginKeyPath(account: string) {
    return this.env.toPath('login:account:' + account);
  }

  private getRepository() {
    return this.conn.manager.getRepository(BlogUserEntity);
  }

  public total() {
    return this.getRepository().countBy({
      forbiden: false,
    });
  }

  public save(target: BlogUserEntity) {
    return this.getRepository().save(target);
  }

  public add(account: string, password: string) {
    return this.save(
      this.getRepository().create()
        .add(account, password)
    );
  }

  public addWithThirdpart(account: string, nickname: string, email: string, avatar: string, website: string, thirdpart: string) {
    return this.save(
      this.getRepository().create()
        .addWithThirdpart(account, nickname, email, avatar, website, thirdpart)
    );
  }

  public getOneByAccount(account: string, thirdpart?: string) {
    const conditions: FindOptionsWhere<BlogUserEntity> = {
      account,
      thirdpart: false,
    }
    if (thirdpart) {
      conditions.thirdpart = true;
      conditions.thirdpart_node_module = thirdpart;
    }
    return this.getRepository().findOneBy(conditions);
  }

  public getOneById(id: number) {
    return this.getRepository().findOneBy({ id });
  }

  public async getMany(page: number, size: number, options: {
    keyword?: string,
    forbiden?: boolean,
    admin?: boolean
  } = {}) {
    const sql = this.getRepository()
      .createQueryBuilder('u')
      .where('1=1')
      .orderBy({
        'u.gmt_create': 'DESC',
        'u.gmt_modified': 'DESC',
      });

    if (options.keyword) {
      sql.andWhere(
        'u.account LIKE :keyword OR u.nickname LIKE :keyword',
        {
          keyword: '%' + options.keyword + '%'
        }
      );
    }

    if (options.forbiden) {
      sql.andWhere('u.forbiden=:forbiden', {
        forbiden: true
      });
    }

    if (options.admin) {
      sql.andWhere('u.admin=:admin', {
        admin: true,
      })
    }

    sql.offset((page - 1) * size).limit(size);

    const [data, total] = await sql.getManyAndCount();

    return {
      total,
      data
    }
  }

  public async addNewUserMetaByCache(account: string, token: string) {
    const maxAgeSec = this.configs.get('loginExpire') * 24 * 60 * 60;
    const token_key = this.createUserLoginTokenKeyPath(token);
    const account_key = this.createUserAccountLoginKeyPath(account);
    await this.cache.connection.set(token_key, {
      value: account,
      relative_key: account_key,
    }, maxAgeSec);
    await this.cache.connection.set(account_key, {
      value: token,
      relative_key: token_key,
    }, maxAgeSec);
    return maxAgeSec;
  }

  public async updateUserMetaByCache(account: string, token: string) {
    const maxAgeSec = this.configs.get('loginExpire') * 24 * 60 * 60;
    const account_token = this.createUserAccountLoginKeyPath(account);
    const key = this.createUserLoginTokenKeyPath(token);

    if (await this.cache.connection.exists(account_token)) {
      const { relative_key } = await this.cache.connection.get<{ value: string, relative_key: string }>(account_token);
      if (await this.cache.connection.exists(relative_key)) {
        await this.cache.connection.del(relative_key);
      }
    }

    await this.cache.connection.set(key, {
      value: account,
      relative_key: account_token,
    }, maxAgeSec);
    await this.cache.connection.set(account, {
      value: token,
      relative_key: key,
    }, maxAgeSec);

    return maxAgeSec;
  }

  public async deleteUserMetaByCache(account: string) {
    const key = this.createUserAccountLoginKeyPath(account);
    if (await this.cache.connection.exists(key)) {
      const { relative_key } = await this.cache.connection.get<{ value: string, relative_key: string }>(key);
      if (await this.cache.connection.exists(relative_key)) {
        await this.cache.connection.del(relative_key);
      }
      await this.cache.connection.del(key);
    }
  }
}