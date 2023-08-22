import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ToDoItemService } from "./to-do-item.service";
import {
  CreateItemDto,
  ItemListResult,
  UpdateItemDto,
} from "../../dto/item.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { PageQueryDto } from "src/dto/base.dto";

@Controller("to-do-item")
export class ToDoItemController {
  @Inject(ToDoItemService)
  private readonly service: ToDoItemService;

  @Post()
  @ApiOkResponse()
  public async create(@Body() dto: CreateItemDto): Promise<string> {
    return await this.service.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: ItemListResult })
  public async getList(@Query() query: PageQueryDto): Promise<ItemListResult> {
    return await this.service.getList({
      ...query,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    });
  }

  @Put(":id")
  public async update(
    @Body() dto: UpdateItemDto,
    @Param("id") id: string
  ): Promise<boolean> {
    await this.service.update(id, dto);
    return true;
  }
}
