import { IsArray, IsNotEmpty, ValidateNested, IsUUID, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';

class PurchaseItemDto {
  @IsUUID()
  productId: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsNotEmpty()
  quantity: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsNotEmpty()
  unitPrice: number;
}

export class CreatePurchaseDto {
  @IsUUID('4') // Especifica a versão do UUID
  userId: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  amount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: Prisma.JsonArray; // Mais específico que InputJsonValue

  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  timestamp: number; // Unix timestamp em milissegundos
}
