import { PrismaClient } from '@prisma/client';

// Declarar a instância do Prisma fora da função para garantir que seja um singleton
let prisma: PrismaClient;

// A lógica de inicialização do PrismaClient deve ser feita aqui.
// Em vez de um try-catch síncrono que pode falhar se o DB não estiver pronto,
// o PrismaClient tentará se conectar quando a primeira query for feita.
// Se você quiser uma verificação de conexão no startup, pode adicionar prisma.$connect()
// e tratá-lo em server.ts.
try {
  prisma = new PrismaClient();
  console.log('PrismaClient instance created.');
} catch (e: any) {
  console.error('FATAL ERROR: Failed to create PrismaClient instance.', e);
  console.error('Please check your DATABASE_URL in .env.');
  // Não saia do processo aqui, apenas logue. O erro real de conexão virá em uma query.
}

export { prisma };
