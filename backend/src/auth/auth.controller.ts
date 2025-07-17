import { Controller, Post, Body, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterUserDto } from "./dto";
import { RegisterKeyDto } from "./dto/index";
import { Response } from "express";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register({
      ...registerUserDto,
      ipAddress: registerUserDto.ipAddress || 'unknown' // Pode pegar do request real
    });
  }

	@Post("login")
	async login(
		@Body() body: { email: string; password: string },
		@Res({ passthrough: true }) res: Response
	) {
		// Primeiro valide o usuário
		const user = await this.authService.validateUser(body.email, body.password);

		// Depois gere os tokens - agora passando apenas o objeto user
		const tokens = await this.authService.login(user);

		res.cookie("refresh_token", tokens.refresh_token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});

		return { access_token: tokens.access_token };
	}

	@Post("register-key")
	async registerPublicKey(@Body() registerKeyDto: RegisterKeyDto) {
		return this.authService.registerPublicKey(
			registerKeyDto.userId,
			registerKeyDto.publicKey
		);
	}
}
