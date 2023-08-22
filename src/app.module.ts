import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import "reflect-metadata";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ToDoItemModule } from "./modules/to-do-item/to-do-item.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "root",
      entities: ["./entity/**/*.ts"],
      database: "toDoList",
      synchronize: true,
    }),
    ToDoItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
