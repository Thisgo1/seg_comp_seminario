import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Middlewares de Segurança
	app.use(helmet());
	app.use(cookieParser());

	// Validação global
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // Remove propriedades não declaradas nos DTOs
			forbidNonWhitelisted: true, // Rejeita requisições com propriedades não declaradas
			transform: true, // Transforma tipos automaticamente
		})
	);

	// Configuração de CORS segura
	app.enableCors({
		origin: process.env.FRONTEND_URLS?.split(",") || true,
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-CSRF-TOKEN",
			"X-Requested-With",
		],
	});

	await app.listen(process.env.PORT || 3001);
	console.log(`Application running on port ${process.env.PORT || 3001}`);
}
bootstrap();
