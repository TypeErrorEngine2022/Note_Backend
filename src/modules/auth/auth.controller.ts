import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "src/dto/auth.dto";
import { Response } from "express";
import { JwtGuard } from "src/guards/jwt.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  public async signup(
    @Body() dto: AuthDto,
    @Res() res: Response
  ): Promise<boolean> {
    const { access_token } = await this.authService.signup(dto);
    res.cookie("jwt", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "localhost",
      maxAge: 1000 * 60 * 5, // "5m"
    });
    return true;
  }

  @Post("signin")
  public async signin(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<boolean> {
    const { access_token } = await this.authService.signin(dto);
    res.cookie("jwt", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "localhost",
      maxAge: 1000 * 60 * 5, // "5m"
    });
    console.log(access_token);

    return true;
  }

  @Get("me")
  @UseGuards(JwtGuard)
  public async profile() {
    return true;
  }

  @Get("signout")
  public async signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "localhost",
      maxAge: 1000 * 60 * 5, // "5m"
    });
    return true;
  }
}
