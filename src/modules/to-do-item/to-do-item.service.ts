import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateItemDto,
  GetItemByCompleteStatusDto,
  ItemBaseResult,
  ItemDetailResult,
  ItemListResult,
  SearchQueryDto,
  UpdateItemDto,
  updateIsCompleteDto,
} from "../../dto/item.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemEntity } from "../../entity/item.entity";
import { Repository } from "typeorm";

@Injectable()
export class ToDoItemService {
  @InjectRepository(ItemEntity)
  private readonly repository: Repository<ItemEntity>;

  public async create(dto: CreateItemDto) {
    const item = await this.repository.create(dto);
    await this.repository.insert(item);
    return item.id;
  }

  public async getList(query: SearchQueryDto): Promise<ItemListResult> {
    let queryBuilder = this.repository
      .createQueryBuilder("item")
      .select(["item.id", "item.title", "item.content", "item.isCompleted"])
      .where("item.isDeleted = :isDeleted", { isDeleted: false });

    if (query.searchContent) {
      queryBuilder = queryBuilder
        .andWhere("item.title ILIKE :searchContent", {
          searchContent: `%${query.searchContent}%`,
        })
        .orWhere("item.content ILIKE :searchContent", {
          searchContent: `%${query.searchContent}%`,
        });
    }

    const items = await queryBuilder
      .orderBy("item.creationTime", "DESC")
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    const total = await this.repository.countBy({ isDeleted: false });

    const res: ItemBaseResult[] = items.map((item) => new ItemBaseResult(item));
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
    let item = await this.getById(id);

    item = { ...item, ...dto };
    await this.repository.save(item);

    return true;
  }

  public async delete(id: string): Promise<boolean> {
    const item = await this.getById(id);

    item.isDeleted = true;
    await this.repository.save(item);

    return true;
  }

  public async updateIsComplete(
    id: string,
    dto: updateIsCompleteDto
  ): Promise<boolean> {
    const item = await this.getById(id);
    item.isCompleted = dto.isCompleted;
    await this.repository.save(item);
    return true;
  }

  public async getDetail(id: string): Promise<ItemDetailResult> {
    const item = await this.getById(id);
    return new ItemDetailResult(item);
  }

  public async getItemsByCompleteStatus(
    query: GetItemByCompleteStatusDto
  ): Promise<ItemListResult> {
    const items = await this.repository
      .createQueryBuilder("item")
      .select(["item.id", "item.title", "item.content", "item.isCompleted"])
      .where("item.isCompleted = :isCompleted", {
        isCompleted: query.isCompleted,
      })
      .andWhere("item.isDeleted = :isDeleted", { isDeleted: false })
      .orderBy("item.creationTime", "DESC")
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    const total = await this.repository.count();

    const res: ItemBaseResult[] = items.map((item) => new ItemBaseResult(item));

    return new ItemListResult(res, query.page, query.pageSize, total);
  }
}
