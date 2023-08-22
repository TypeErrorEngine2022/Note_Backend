import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ToDoItemService } from "./to-do-item.service";
import { CreateItemDto } from "../../dto/item.dto";

@Controller("to-do-item")
export class ToDoItemController {
  @Inject(ToDoItemService)
  private readonly service: ToDoItemService;

  @Post()
  public async create(@Body() dto: CreateItemDto) {
    return this.service.create(dto);
  }
}
