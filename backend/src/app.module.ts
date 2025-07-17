import { Module, MiddlewareConsumer } from '@nestjs/common'; // Adicione MiddlewareConsumer aqui
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PurchaseModule } from './purchase/purchase.module';
import { CryptoModule } from './crypto/crypto.module';
import { CsrfMiddleware } from './security/csrf/csrf.middleware';
import { CsrfController } from './security/csrf/csrf.controller';
import { CsrfModule } from './security/csrf/csrf.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    PurchaseModule,
    CryptoModule,
    CsrfModule
  ],
  controllers: [AppController, CsrfController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfMiddleware)
      .forRoutes('*'); // Aplica para todas as rotas
  }
}
