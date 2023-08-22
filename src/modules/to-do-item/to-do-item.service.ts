import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateItemDto,
  ItemBaseResult,
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
      .select(["item.id", "item.title"])
      .where("item.isDeleted = :isDeleted", { isDeleted: false })
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

  public async getById(id: string) {
    const item = await this.repository.findOneBy({ id: id, isDeleted: false });
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }

  public async update(id: string, dto: UpdateItemDto): Promise<boolean> {
    const item = await this.getById(id);

    item.title = dto.title;
    item.content = dto.content;
    await this.repository.save(item);

    return true;
  }

  public async delete(id: string): Promise<boolean> {
    const item = await this.getById(id);

    item.isDeleted = true;
    await this.repository.save(item);

    return true;
  }
}
