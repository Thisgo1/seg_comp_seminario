import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('purchase')
@UseGuards(AuthGuard)
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  async createPurchase(
    @Body() data: any,
    @Headers('x-payload-signature') signature: string,
    @Headers('authorization') authHeader: string
  ) {
    // Extrair user ID do token JWT
    const userId = this.extractUserIdFromToken(authHeader);
    
    return this.purchaseService.processPurchase(
      userId,
      { ...data, timestamp: Date.now() }, // Adiciona timestamp
      signature
    );
  }

  private extractUserIdFromToken(authHeader: string): number {
    const token = authHeader.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.sub;
  }
}
