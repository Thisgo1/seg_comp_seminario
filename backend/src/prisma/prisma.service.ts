import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect();
		try {
			await this.$executeRaw`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
		} catch (error) {
			console.warn("Failed to create pgcrypto extension:", error.message);
		}
	}
}
