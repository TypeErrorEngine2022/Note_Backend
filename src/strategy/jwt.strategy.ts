import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/entity/User.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";

/**
 * @param 'jwt' key for AuthGuard
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    config: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      secretOrKey: config.get("JWT_SECRET"),
    });
  }

  static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.jwt) {
      console.log(req.cookies.jwt);
      return req.cookies.jwt;
    }
    console.log(JSON.stringify(req.cookies));
    return null;
  }

  async validate(payload: { sub: string }) {
    const user = await this.userRepository.findOneBy({ userName: payload.sub });
    return user;
  }
}
