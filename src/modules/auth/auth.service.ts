import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { hash, verify } from "argon2";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/entity/User.entity";
import { AuthDto } from "src/dto/auth.dto";
import { ItemEntity } from "src/entity/item.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: AuthDto): Promise<{
    access_token: string;
  }> {
    const userExist = await this.userRepository.findOneBy({
      userName: dto.userName,
    });
    if (userExist) {
      throw new ForbiddenException("userName is already used");
    }

    const passwordHash = await hash(dto.password);

    const user = this.userRepository.create({
      userName: dto.userName,
      passwordHash: passwordHash,
      items: new Array<ItemEntity>(),
    });

    console.log(user);

    await this.userRepository.save(user);
    return this.signToken(user.userName);
  }

  async signin(dto: AuthDto): Promise<{
    access_token: string;
  }> {
    const user = await this.userRepository.findOneBy({
      userName: dto.userName,
    });
    if (!user) {
      throw new NotFoundException("account not exist");
    }

    const passwordMatch = await verify(user.passwordHash, dto.password);
    if (!passwordMatch) {
      console.log("wrong password");
      throw new UnauthorizedException("wrong password");
    }

    // signin success
    return this.signToken(user.userName);
  }

  private async signToken(email: string): Promise<{
    access_token: string;
  }> {
    const payload = {
      sub: email,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: "30m",
      secret: this.config.get("JWT_SECRET"),
    });

    return {
      access_token: token,
    };
  }
}
