// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Middlewares de Segurança
  app.use(helmet());
  app.use(cookieParser()); // Necessário para o CSRF via cookie
  
  // Configuração de CORS segura
  app.enableCors({
    origin: process.env.FRONTEND_URL?.split(',') || true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-TOKEN', 'Authorization']
  });

  // Rate Limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Limite por IP
      skip: (req) => {
        // Ignora limitação para endpoints de saúde e CSRF
        return req.originalUrl.includes('/health') || 
               req.originalUrl.includes('/csrf/token');
      }
    })
  );
  
  await app.listen(process.env.PORT || 3001);
  console.log(`Application running on port ${process.env.PORT || 3001}`);
}
bootstrap();
