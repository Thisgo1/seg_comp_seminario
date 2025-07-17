import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CryptoService } from "../crypto/crypto.service";
import { CreatePurchaseDto } from "./dto";

@Injectable()
export class PurchaseService {
	private readonly logger = new Logger(PurchaseService.name);

	constructor(
		private prisma: PrismaService,
		private cryptoService: CryptoService
	) {}

	async processPurchase(userId: string, createPurchaseDto: CreatePurchaseDto) {
		// 1. Validação de timestamp
		this.validateTimestamp(createPurchaseDto.timestamp);

		// 2. Busca e validação da chave pública
		const publicKey = await this.getUserPublicKey(userId);

		// 3. Verificação de assinatura
		this.verifySignature(publicKey, createPurchaseDto);

		// 4. Criação da compra com transação segura
		return this.createPurchaseTransaction(userId, createPurchaseDto);
	}

	private validateTimestamp(timestamp: number) {
		const maxAge = 5000; // 5 segundos
		if (Date.now() - timestamp > maxAge) {
			this.logger.warn(`Timestamp expired for purchase attempt`);
			throw new UnauthorizedException("Request expired");
		}
	}

	private async getUserPublicKey(userId: string): Promise<string> {
		// 1. Validação rigorosa do UUID
		if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) {
			this.logger.error(`Invalid UUID format: ${userId}`);
			throw new UnauthorizedException('Invalid user ID format');
		}
	
		try {
			// 2. Verifique primeiro se a tabela existe
			await this.prisma.$queryRaw`SELECT 1 FROM "PublicKey" LIMIT 1`;
	
			// 3. Query com preparação explícita de parâmetros
			const publicKeyResult = await this.prisma.$queryRaw<{ key: string }[]>`
				SELECT pgp_sym_decrypt(
					key::bytea, 
					current_setting('app.encryption_key')
				) as key
				FROM "PublicKey"
				WHERE user_id = uuid(${userId})
			`;
	
			if (!publicKeyResult?.length) {
				throw new Error('Public key not found');
			}
			
			return publicKeyResult[0].key;
		} catch (error) {
			this.logger.error(`Error retrieving public key: ${error.message}`);
			throw new UnauthorizedException('Failed to retrieve public key');
		}
	}

private isValidUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}
	private async verifySignature(publicKey: string, dto: CreatePurchaseDto) {
		// Extrai os dados do payload sem a assinatura para verificação
		const { signature, ...payload } = dto;
		const isValid = await this.cryptoService.verifySignature(
			publicKey,
			payload,
			signature
		);

		if (!isValid) {
			this.logger.warn(`Invalid signature for purchase attempt by user`);
			throw new UnauthorizedException("Invalid signature");
		}
	}

	private async createPurchaseTransaction(
		userId: string,
		dto: CreatePurchaseDto
	) {
		return this.prisma.$transaction(async (prisma) => {
			// 1. Cria a compra
			const purchase = await prisma.purchase.create({
				data: {
					userId,
					amount: dto.amount,
					items: dto.items,
					signature: dto.signature,
					status: "completed",
				},
			});

			// 2. Registra na auditoria
			await prisma.auditLog.create({
				data: {
					action: "PURCHASE",
					userId,
					metadata: {
						purchaseId: purchase.id,
						amount: dto.amount,
					},
				},
			});

			return purchase;
		});
	}
}
