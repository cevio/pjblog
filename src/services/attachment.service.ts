import { Service } from "@zille/service";
import { DataBaseConnnectionNameSpace } from "../middlewares/database.mdw";
import { DataBaseConnection } from "../global.types";
import { BlogAttachmentEntity } from "../entities/attachment.entity";
import { FindOptionsWhere } from "typeorm";

@Service.Injectable()
export class AttachmentyService extends Service {
  @Service.Inject(DataBaseConnnectionNameSpace)
  private readonly conn: DataBaseConnection;

  private getRepository() {
    return this.conn.manager.getRepository(BlogAttachmentEntity);
  }

  public save(target: BlogAttachmentEntity) {
    return this.getRepository().save(target);
  }

  public add(path: string, size: number, type: string, md5: string) {
    return this.save(this.getRepository().create().update(path, size, type, md5));
  }

  public getOneByMd5(md5: string) {
    return this.getRepository().findOneBy({
      md5
    })
  }

  public getOneById(id: number) {
    return this.getRepository().findOneBy({
      id
    })
  }

  public del(target: BlogAttachmentEntity) {
    return this.getRepository().remove(target);
  }

  public getMany(page: number, size: number, type?: string) {
    const conditions: FindOptionsWhere<BlogAttachmentEntity> = {}
    if (type) {
      conditions.type = type;
    }
    return this.getRepository().findAndCount({
      where: conditions,
      order: {
        gmt_create: 'DESC',
      },
      skip: (page - 1) * size,
      take: size
    })
  }
}