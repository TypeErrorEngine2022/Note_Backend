import {
  Body,
  Controller,
  Delete,
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
  GetItemByCompleteStatusDto,
  ItemDetailResult,
  ItemListResult,
  UpdateItemDto,
  updateIsCompleteDto,
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

  @Delete(":id")
  public async delete(@Param("id") id: string): Promise<boolean> {
    await this.service.delete(id);
    return true;
  }

  @Put(":id/complete")
  public async updateIsComplete(
    @Param("id") id: string,
    @Body() dto: updateIsCompleteDto
  ): Promise<boolean> {
    await this.service.updateIsComplete(id, dto);
    return true;
  }

  @Get(":id/detail")
  public async getDetail(@Param("id") id: string): Promise<ItemDetailResult> {
    return await this.service.getDetail(id);
  }

  @Get("/complete")
  public async getItemsByCompleteStatus(
    @Query() query: GetItemByCompleteStatusDto
  ): Promise<ItemListResult> {
    return await this.service.getItemsByCompleteStatus({
      ...query,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    });
  }
}
