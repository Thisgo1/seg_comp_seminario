import { Controller, Post, Body, Headers, UseGuards } from "@nestjs/common";
import { PurchaseService } from "./purchase.service";
import { AuthGuard } from "../auth/auth.guard";
import { CreatePurchaseDto } from "./dto";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Purchases")
@Controller("purchase")
export class PurchaseController {
	constructor(private readonly purchaseService: PurchaseService) {}

	@Post()
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiBody({ type: CreatePurchaseDto })
	@ApiResponse({ status: 201, description: "Purchase created successfully" })
	async createPurchase(
		@Body() createPurchaseDto: CreatePurchaseDto,
		@Headers("authorization") authHeader: string
	) {
		const userId = this.extractUserIdFromToken(authHeader);
		return this.purchaseService.processPurchase(userId, createPurchaseDto);
	}

	private extractUserIdFromToken(authHeader: string): string {
		// Alterado para string
		const token = authHeader.split(" ")[1];
		const payload = JSON.parse(
			Buffer.from(token.split(".")[1], "base64").toString()
		);
		return payload.sub.toString(); // Convertendo para string
	}
}
