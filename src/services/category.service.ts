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
import { BlogCategoryEntity } from "../entities/category.entity";

@Service.Injectable()
export class CategoryService extends Service {
  @Service.Inject(DataBaseConnnectionNameSpace)
  private readonly conn: DataBaseConnection;

  private getRepository() {
    return this.conn.manager.getRepository(BlogCategoryEntity);
  }

  public save(target: BlogCategoryEntity) {
    return this.getRepository().save(target);
  }

  public add(name: string, link?: string) {
    return this.save(this.getRepository().create().add(name, link));
  }

  public del(category: BlogCategoryEntity) {
    return this.getRepository().remove(category);
  }

  public getOneById(id: number) {
    return this.getRepository().findOneBy({ id });
  }

  public getMany() {
    return this.getRepository().find()
  }
}