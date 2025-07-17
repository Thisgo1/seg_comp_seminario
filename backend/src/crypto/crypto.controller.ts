import { Controller, Post, Body } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('verify')
  async verifySignature(@Body() body: { publicKey: string; payload: any; signature: string }) {
    return this.cryptoService.verifySignature(
      body.publicKey,
      body.payload,
      body.signature
    );
  }
}
