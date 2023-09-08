import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import "reflect-metadata";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ToDoItemModule } from "./modules/to-do-item/to-do-item.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { UserEntity } from "./entity/User.entity";
import { ItemEntity } from "./entity/item.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "root",
      entities: [UserEntity, ItemEntity],
      database: "toDoList",
      synchronize: true,
      // dropSchema: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ToDoItemModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
