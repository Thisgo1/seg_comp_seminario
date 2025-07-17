import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  publicKey?: string; // Chave pública em formato PEM

  @IsOptional()
  ipAddress?: string; // Para auditoria
}
