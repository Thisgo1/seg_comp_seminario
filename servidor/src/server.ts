import dotenv from "dotenv";
dotenv.config(); // Carregar variáveis de ambiente do .env

// ADICIONADO: Validação de variáveis de ambiente críticas
function validateEnvVariables() {
	const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "PORT", "HTTPS_PORT"];
	const missingEnv = requiredEnv.filter((envVar) => !process.env[envVar]);

	if (missingEnv.length > 0) {
		console.error(
			`FATAL ERROR: Missing required environment variables: ${missingEnv.join(
				", "
			)}`
		);
		process.exit(1); // Sai do processo se variáveis críticas estiverem faltando
	}
	console.log("All required environment variables are set.");
}
validateEnvVariables(); // Chamar a validação no início

import app from "./app";
import https from "https";
import fs from "fs";
import { prisma } from "./lib/prisma";
import { auditLog } from "./services/auditService";

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443; // Porta para HTTPS

// --- Configuração HTTPS ---
let privateKey: Buffer;
let certificate: Buffer;
let credentials: { key: Buffer; cert: Buffer } | undefined;

try {
	console.log("Attempting to load SSL/TLS certificates...");
	privateKey = fs.readFileSync("./certs/key.pem");
	certificate = fs.readFileSync("./certs/cert.pem");
	credentials = { key: privateKey, cert: certificate };
	console.log("Certificados SSL/TLS carregados com sucesso.");
} catch (error) {
	console.warn(
		"AVISO: Certificados SSL/TLS não encontrados em ./certs/. O servidor será iniciado apenas via HTTP."
	);
	console.warn(
		"Para HTTPS, crie os arquivos key.pem e cert.pem na pasta certs/, ou ajuste os caminhos."
	);
}

async function main() {
	console.log("Starting main server function...");

	// Opcional: Testar a conexão com o banco de dados no startup
	try {
		await prisma.$connect();
		console.log("Successfully connected to the database via Prisma.");
	} catch (dbError: any) {
		console.error("FATAL ERROR: Failed to connect to the database.", dbError);
		console.error(
			"Please check your DATABASE_URL in .env and ensure your PostgreSQL server is running and accessible."
		);
		await auditLog(
			null,
			"DB_CONNECTION_ERROR",
			`Failed to connect to database: ${dbError.message}`
		);
		process.exit(1); // Sai do processo se não conseguir conectar ao DB
	}

	// Inicia o servidor HTTP
	app.listen(PORT, () => {
		console.log(`HTTP Server running on port ${PORT}`);
		auditLog(null, "SERVER_START", `HTTP Server started on port ${PORT}`);
	});

	// Inicia o servidor HTTPS se os certificados existirem
	if (credentials) {
		const httpsServer = https.createServer(credentials, app);
		httpsServer.listen(HTTPS_PORT, () => {
			console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
			auditLog(
				null,
				"SERVER_START",
				`HTTPS Server started on port ${HTTPS_PORT}`
			);
		});
	}
	console.log("Server setup complete. Waiting for connections...");
}

main().catch(async (e) => {
	console.error("Fatal Error during server startup:", e);
	await auditLog(null, "SERVER_ERROR", `Server crashed: ${e.message}`);
	process.exit(1);
});

// Adicionar um handler para desligamento gracioso
process.on("SIGINT", async () => {
	console.log("SIGINT received. Shutting down gracefully...");
	await prisma.$disconnect();
	console.log("Prisma disconnected. Exiting.");
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("SIGTERM received. Shutting down gracefully...");
	await prisma.$disconnect();
	console.log("Prisma disconnected. Exiting.");
	process.exit(0);
});
