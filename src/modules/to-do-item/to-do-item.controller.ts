import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { ToDoItemService } from "./to-do-item.service";
import { CreateItemDto, ItemListResult } from "../../dto/item.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { PageQueryDto } from "src/dto/base.dto";

@Controller("to-do-item")
export class ToDoItemController {
  @Inject(ToDoItemService)
  private readonly service: ToDoItemService;

  @Post()
  @ApiOkResponse()
  public async create(@Body() dto: CreateItemDto): Promise<string> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: ItemListResult })
  public async getList(@Query() query: PageQueryDto): Promise<ItemListResult> {
    return this.service.getList({
      ...query,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    });
  }
}
