import { Module } from "@nestjs/common";
import { ToDoItemController } from "./to-do-item.controller";
import { ToDoItemService } from "./to-do-item.service";

@Module({
  controllers: [ToDoItemController],
  providers: [ToDoItemService],
})
export class ToDoItemModule {}
