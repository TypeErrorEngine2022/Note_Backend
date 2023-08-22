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
}

export class UpdateItemDto extends CreateItemDto {}
