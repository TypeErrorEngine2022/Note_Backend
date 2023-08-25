import { Type } from "class-transformer";

export class PageQueryDto {
  @Type(() => Number)
  page?: number;

  @Type(() => Number)
  pageSize?: number;
}
