import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "src/strategy/jwt.strategy";
import { UserEntity } from "src/entity/User.entity";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { UserController } from "../user/user.controller";
import { UserService } from "../user/user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, JwtStrategy, UserService],
  exports: [AuthService],
})
export class AuthModule {}
