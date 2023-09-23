import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserEntity } from "src/entity/User.entity";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserEntity;
    return user;
  }
);
