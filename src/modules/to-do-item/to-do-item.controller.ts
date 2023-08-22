import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ToDoItemService } from "./to-do-item.service";
import { CreateItemDto } from "../../dto/item.dto";
import { ApiOkResponse } from "@nestjs/swagger";

@Controller("to-do-item")
export class ToDoItemController {
  @Inject(ToDoItemService)
  private readonly service: ToDoItemService;

  @Post()
  @ApiOkResponse()
  public async create(@Body() dto: CreateItemDto): Promise<string> {
    return this.service.create(dto);
  }
}
