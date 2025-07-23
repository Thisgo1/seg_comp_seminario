import { prisma } from '../lib/prisma'; 

export const auditLog = async (
  userId: string | null,
  action: string,
  details: string,
  ipAddress?: string
) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar log de auditoria:', error);
    // Em produção, você pode ser usado um sistema de log mais robusto aqui (e.g., Sentry, ELK)
  }
};
