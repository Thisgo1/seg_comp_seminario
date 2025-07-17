import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterUserDto } from "./dto";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService
	) {}

	async register(registerUserDto: RegisterUserDto) {
		const { email, password, publicKey } = registerUserDto;

		// Verifica se o usuário já existe
		const existingUser = await this.prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			throw new ConflictException("Email já está em uso");
		}

		// Criptografa a senha
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Cria transação atômica para usuário e chave pública
		return this.prisma.$transaction(async (prisma) => {
			const user = await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
				},
				select: {
					id: true,
					email: true,
					createdAt: true,
				},
			});

			// Se foi fornecida uma chave pública, registra
			if (publicKey) {
				await prisma.publicKey.create({
					data: {
						key: publicKey,
						algorithm: "ES256",
						expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
						user: { connect: { id: user.id } },
					},
				});
			}

			// Cria log de auditoria
			await prisma.auditLog.create({
				data: {
					action: "REGISTER",
					userId: user.id,
					metadata: { ip: registerUserDto.ipAddress },
				},
			});

			return user;
		});
	}

	/**
	 * Valida as credenciais do usuário
	 * @param email Email do usuário
	 * @param password Senha fornecida
	 * @returns Informações do usuário sem dados sensíveis
	 */
	async validateUser(email: string, password: string): Promise<any> {
		// Busca usuário pelo email
		const user = await this.prisma.user.findUnique({ where: { email } });
		if (!user) throw new UnauthorizedException("Credenciais inválidas");

		// Compara senha com hash armazenada (usando bcrypt)
		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) throw new UnauthorizedException("Credenciais inválidas");

		// Retorna apenas dados não sensíveis
		return { id: user.id, email: user.email };
	}

	/**
	 * Gera tokens JWT para o usuário
	 * @param user Dados do usuário
	 * @returns { access_token, refresh_token }
	 */
	async login(user: any) {
		const payload = { email: user.email, sub: user.id };

		return {
			access_token: this.jwtService.sign(payload, {
				secret: process.env.JWT_SECRET,
				expiresIn: process.env.JWT_EXPIRES_IN,
			}),
			refresh_token: this.jwtService.sign(payload, {
				secret: process.env.REFRESH_SECRET,
				expiresIn: process.env.REFRESH_EXPIRES_IN,
			}),
		};
	}
	/**
	 * Registra nova chave pública para o usuário
	 * @param userId ID do usuário
	 * @param publicKey Chave pública em formato PEM
	 */
	async registerPublicKey(userId: string, publicKey: string) {
		// Criptografa a chave antes de armazenar (usando extensão pgcrypto)
		await this.prisma.$executeRaw`
      INSERT INTO public_keys (user_id, public_key, algorithm)
      VALUES (
        ${userId}, 
        pgp_sym_encrypt(${publicKey}, ${process.env.DB_ENCRYPTION_KEY}),
        'ES256'
      )
      ON CONFLICT (user_id) DO UPDATE
      SET public_key = EXCLUDED.public_key
    `;
	}
}
