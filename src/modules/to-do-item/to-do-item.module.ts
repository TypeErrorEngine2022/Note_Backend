import { Module } from "@nestjs/common";
import { ToDoItemController } from "./to-do-item.controller";
import { ToDoItemService } from "./to-do-item.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemEntity } from "../../entity/item.entity";
import { UserEntity } from "src/entity/User.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity, UserEntity])],
  controllers: [ToDoItemController],
  providers: [ToDoItemService],
})
export class ToDoItemModule {}
