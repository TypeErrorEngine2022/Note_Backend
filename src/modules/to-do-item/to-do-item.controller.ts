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
  UseGuards,
} from "@nestjs/common";
import { ToDoItemService } from "./to-do-item.service";
import {
  CreateItemDto,
  GetItemByCompleteStatusDto,
  ItemDetailResult,
  ItemListDto,
  ItemListResult,
  SearchQueryDto,
  UpdateItemDto,
  updateIsCompleteDto,
} from "../../dto/item.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { JwtGuard } from "src/guards/jwt.guard";
import { User } from "../auth/user.decorator";
import { UserEntity } from "src/entity/User.entity";

@Controller("to-do-item")
@UseGuards(JwtGuard)
export class ToDoItemController {
  @Inject(ToDoItemService)
  private readonly service: ToDoItemService;

  @Post()
  @ApiOkResponse()
  public async create(
    @User() user: UserEntity,
    @Body() dto: CreateItemDto
  ): Promise<string> {
    return await this.service.create(user, dto);
  }

  @Get()
  @ApiOkResponse({ type: ItemListResult })
  public async getList(
    @User() user: UserEntity,
    @Query() query: SearchQueryDto
  ): Promise<ItemListResult> {
    const res = await this.service.getList(user, {
      ...query,
      page: query.page || 1,
      pageSize: query.pageSize || 10,
    });
    // console.log(res);
    return res;
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

  @Delete("batch")
  public async batchDelete(@Query() query: ItemListDto) {
    return await this.service.batchDelete(query);
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
}
