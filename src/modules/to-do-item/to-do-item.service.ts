import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateItemDto,
  ItemListResult,
  UpdateItemDto,
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
      .select(["item.title"])
      .orderBy("item.creationTime", "DESC")
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    const total = await this.repository.count();

    return new ItemListResult(items, query.page, query.pageSize, total);
  }

  public async update(id: string, dto: UpdateItemDto): Promise<boolean> {
    const item = await this.repository.findOneBy({ id: id });
    if (!item) {
      throw new NotFoundException();
    }

    item.title = dto.title;
    item.content = dto.content;
    await this.repository.save(item);

    return true;
  }
}
