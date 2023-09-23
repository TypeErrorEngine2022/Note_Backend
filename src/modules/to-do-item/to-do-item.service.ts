import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateItemDto,
  GetItemByCompleteStatusDto,
  ItemBaseResult,
  ItemDetailResult,
  ItemListDto,
  ItemListResult,
  SearchQueryDto,
  UpdateItemDto,
  updateIsCompleteDto,
} from "../../dto/item.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemEntity } from "../../entity/item.entity";
import { Repository } from "typeorm";
import { UserEntity } from "src/entity/User.entity";

@Injectable()
export class ToDoItemService {
  @InjectRepository(ItemEntity)
  private readonly itemRepository: Repository<ItemEntity>;

  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;

  public async create(user: UserEntity, dto: CreateItemDto) {
    const item = await this.itemRepository.create({ ...dto, user: user });
    await this.itemRepository.insert(item);
    console.log(item);
    return item.id;
  }

  public async getList(
    user: UserEntity,
    query: SearchQueryDto
  ): Promise<ItemListResult> {
    console.log(query);
    console.log(user.id);
    let queryBuilder = this.itemRepository
      .createQueryBuilder("item")
      .leftJoin("item.user", "user")
      .select([
        "item.id",
        "item.title",
        "item.content",
        "item.isCompleted",
        "user",
        "item.creationTime",
      ])
      .where("item.isDeleted = :isDeleted", { isDeleted: false })
      .andWhere("user.id = :id", { id: user.id });

    if (query.isDeleted) {
      queryBuilder = queryBuilder.andWhere("item.isDeleted = :isDeleted", {
        isDeleted: query.isDeleted,
      });
    } else {
      queryBuilder = queryBuilder.andWhere("item.isDeleted = :isDeleted", {
        isDeleted: false,
      });
    }

    if (query.searchContent) {
      queryBuilder = queryBuilder.andWhere(
        "(item.content ILIKE :search OR item.title ILIKE :search)",
        { search: `%${query.searchContent}%` }
      );
    }

    if (query.isCompleted) {
      queryBuilder = queryBuilder.andWhere("item.isCompleted = :isCompleted", {
        isCompleted: query.isCompleted,
      });
    }
    const items = await queryBuilder
      .orderBy("item.creationTime", "DESC")
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    const total = await queryBuilder.getCount();

    const res: ItemBaseResult[] = items.map((item) => new ItemBaseResult(item));
    return new ItemListResult(res, query.page, query.pageSize, total);
  }

  public async getById(id: string) {
    const item = await this.itemRepository.findOneBy({
      id: id,
      isDeleted: false,
    });
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }

  public async update(id: string, dto: UpdateItemDto): Promise<boolean> {
    let item = await this.getById(id);

    item = { ...item, ...dto };
    await this.itemRepository.save(item);

    return true;
  }

  public async delete(id: string): Promise<boolean> {
    const item = await this.getById(id);

    item.isDeleted = true;
    await this.itemRepository.save(item);

    return true;
  }

  public async updateIsComplete(
    id: string,
    dto: updateIsCompleteDto
  ): Promise<boolean> {
    const item = await this.getById(id);
    item.isCompleted = dto.isCompleted;
    await this.itemRepository.save(item);
    return true;
  }

  public async getDetail(id: string): Promise<ItemDetailResult> {
    const item = await this.getById(id);
    return new ItemDetailResult(item);
  }

  public async getItemsByCompleteStatus(
    query: GetItemByCompleteStatusDto
  ): Promise<ItemListResult> {
    const items = await this.itemRepository
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

    const total = await this.itemRepository.count();

    const res: ItemBaseResult[] = items.map((item) => new ItemBaseResult(item));

    return new ItemListResult(res, query.page, query.pageSize, total);
  }

  public async batchDelete(query: ItemListDto) {
    if (!query.items) return false;

    await Promise.all(query.items.map((id: string) => this.delete(id)));
    return true;
  }
}
