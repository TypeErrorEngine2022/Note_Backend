import { Module } from "@nestjs/common";
import { ToDoItemController } from "./to-do-item.controller";
import { ToDoItemService } from "./to-do-item.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemEntity } from "../../entity/item.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  controllers: [ToDoItemController],
  providers: [ToDoItemService],
})
export class ToDoItemModule {}
