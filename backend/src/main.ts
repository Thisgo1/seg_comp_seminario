// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';  // Importação modificada
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Middlewares de Segurança
  app.use(helmet());
  app.use(cookieParser());
  app.use(csurf({ cookie: true }));  // Removido o .default()
  
  app.enableCors({
    origin: true,
    credentials: true,
  })

  // Rate Limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    })
  );
  
  await app.listen(3001);
}
bootstrap();
