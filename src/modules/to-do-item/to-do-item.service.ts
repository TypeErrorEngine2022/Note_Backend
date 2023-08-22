import { Injectable } from "@nestjs/common";
import {
  CreateItemDto,
  ItemBaseResult,
  ItemListResult,
} from "../../dto/item.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemEntity } from "../../entity/item.entity";
import { Repository } from "typeorm";
import { PageQueryDto } from "src/dto/base.dto";

@Injectable()
export class ToDoItemService {
  @InjectRepository(ItemEntity)
  private readonly repository: Repository<ItemEntity>;

  public async create(dto: CreateItemDto) {
    const item = await this.repository.create(dto);
    await this.repository.insert(item);
    return item.id;
  }

  public async getList(query: PageQueryDto): Promise<ItemListResult> {
    const items = await this.repository
      .createQueryBuilder("item")
      .select(["item.id", "item.title"])
      .orderBy("item.creationTime", "DESC")
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    const total = await this.repository.count();

    const res: ItemBaseResult[] = items.map((item) => ({
      id: item.id,
      title: item.title,
    }));

    return new ItemListResult(res, query.page, query.pageSize, total);
  }
}
