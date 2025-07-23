import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; 
import { verifyDigitalSignature } from '../services/cryptoService';
import { auditLog } from '../services/auditService';

export const createPurchase = async (req: Request, res: Response) => {
  const { payload, signature } = req.body; // payload é o objeto da compra, signature é a assinatura
  const userId = req.user?.id; // ID do usuário do token JWT

  if (!userId) {
    auditLog(null, 'PURCHASE_ATTEMPT_NO_USER', `Purchase attempt without authenticated user from IP: ${req.ip}`);
    return res.status(401).send('Unauthorized: User not identified.');
  }

  if (!payload || !signature) {
    auditLog(userId, 'PURCHASE_ATTEMPT_INVALID_DATA', `Missing payload or signature for user ${userId} from IP: ${req.ip}`);
    return res.status(400).send('Payload and signature are required.');
  }

  // Extrair productId e amount do payload
  const { productId, amount } = payload; // ADICIONADO: Desestruturar productId e amount do payload

  // Validar se productId e amount existem e são do tipo correto
  if (!productId || typeof productId !== 'string') {
    auditLog(userId, 'PURCHASE_ATTEMPT_INVALID_PRODUCT_ID', `Invalid or missing productId in payload for user ${userId}.`);
    return res.status(400).send('Invalid or missing productId in payload.');
  }
  if (typeof amount !== 'number' || amount <= 0) { // Verifica se é número e positivo
    auditLog(userId, 'PURCHASE_ATTEMPT_INVALID_AMOUNT', `Invalid or missing amount in payload for user ${userId}.`);
    return res.status(400).send('Invalid or missing amount in payload.');
  }

  try {
    // 1. Obter a chave pública do usuário do banco de dados
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { publicKey: true },
    });

    if (!user || !user.publicKey) {
      auditLog(userId, 'PURCHASE_ATTEMPT_NO_PUBLIC_KEY', `User ${userId} attempting purchase but no public key found.`);
      return res.status(404).send('User public key not found.');
    }

    // 2. Verificar a assinatura digital
    const isSignatureValid = await verifyDigitalSignature(user.publicKey, payload, signature);

    if (!isSignatureValid) {
      auditLog(userId, 'SIGNATURE_INVALID', `Invalid signature for purchase attempt by user ${userId}. Payload: ${JSON.stringify(payload)}`);
      return res.status(401).send('Invalid digital signature.');
    }

    // 3. Assinatura válida: processar a compra
    const newPurchase = await prisma.purchase.create({
      data: {
        userId,
        productId, // CORRIGIDO: Passar productId do payload
        amount,     // CORRIGIDO: Passar amount do payload
        status: 'completed', // ou 'pending' dependendo da sua lógica de negócio
      },
    });

    auditLog(userId, 'PURCHASE_SUCCESS', `Purchase ID ${newPurchase.id} successfully created by user ${userId}.`);
    res.status(201).json({ message: 'Purchase successful', purchase: newPurchase });
  } catch (error: any) {
    console.error('Error creating purchase:', error);
    auditLog(userId, 'PURCHASE_ERROR', `Error creating purchase for user ${userId}: ${error.message}`);
    res.status(500).send('Error processing purchase.');
  }
};
