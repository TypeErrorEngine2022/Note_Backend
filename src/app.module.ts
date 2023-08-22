import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import "reflect-metadata";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ToDoItemModule } from "./modules/to-do-item/to-do-item.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "root",
      entities: ["dist/**/*.entity.{ts,js}"],
      database: "toDoList",
      synchronize: true,
      dropSchema: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ToDoItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
