import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class PurchaseService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService
  ) {}

  async processPurchase(userId: number, purchaseData: any, signature: string) {
    // 1. Verificar timestamp (prevenir replay attacks)
    const maxAge = 5000; // 5 segundos
    if (Date.now() - purchaseData.timestamp > maxAge) {
      throw new UnauthorizedException('Request expired');
    }

    // 2. Buscar chave pública
    const publicKeyResult = await this.prisma.$queryRaw<{ key: string }[]>`
      SELECT pgp_sym_decrypt(
        key::bytea, 
        current_setting('app.encryption_key')
      ) as key
      FROM "PublicKey"
      WHERE user_id = ${userId}
    `;
    
    if (!publicKeyResult.length) {
      throw new UnauthorizedException('Public key not found');
    }
    
    // 3. Verificar assinatura
    const isValid = await this.cryptoService.verifySignature(
      publicKeyResult[0].key,
      purchaseData,
      signature
    );
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }
    
    // 4. Registrar compra
    return this.prisma.purchase.create({
      data: {
        userId,
        amount: purchaseData.amount,
        items: purchaseData.items,
        signature
      }
    });
  }
}
