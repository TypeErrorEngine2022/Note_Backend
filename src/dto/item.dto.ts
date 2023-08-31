import { ItemEntity } from "src/entity/item.entity";
import { PageQueryDto } from "./base.dto";

export class CreateItemDto {
  title: string;
  content: string;
}

export class ItemListResult {
  items: ItemBaseResult[];
  page: number;
  pageSize: number;
  total: number;

  constructor(
    items: ItemBaseResult[],
    page: number,
    pageSize: number,
    total: number
  ) {
    this.items = items;
    this.page = page;
    this.pageSize = pageSize;
    this.total = total;
  }
}

export class ItemBaseResult {
  id: string;
  title: string;
  isCompleted: boolean;
  preview: string;

  constructor(item: ItemEntity) {
    const data = {
      id: item.id,
      title: item.title,
      isCompleted: item.isCompleted,
      preview:
        item.content.length > 10 ? item.content.slice(0, 11) : item.content,
    };
    Object.assign(this, data);
  }
}

export class ItemDetailResult extends ItemBaseResult {
  content: string;
  lastModificationTime: Date;

  constructor(item: ItemEntity) {
    super(item);
    const data = {
      content: item.content,
      lastModificationTime: item.lastModificationTime,
    };
    Object.assign(this, data);
  }
}

export class UpdateItemDto extends CreateItemDto {}

export class updateIsCompleteDto {
  isCompleted: boolean;
}

export class GetItemByCompleteStatusDto extends PageQueryDto {
  isCompleted: boolean;
}

export class SearchQueryDto extends PageQueryDto {
  searchContent?: string;
  isCompleted?: boolean;
  isDeleted?: boolean;
}

export class ItemListDto {
  items: string[];
}
