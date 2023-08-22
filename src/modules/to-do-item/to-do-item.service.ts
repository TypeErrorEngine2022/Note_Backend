import { Injectable } from "@nestjs/common";
import { CreateItemDto } from "../../dto/item.dto";
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
}
