import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; 
import { signPayload, decryptKey } from '../services/cryptoService';
import { auditLog } from '../services/auditService';
import { webcrypto } from 'crypto'; // Para derivar chave de criptografia
import bcrypt from 'bcrypt';

// Função auxiliar (redefinida do authService para evitar circular dependency)
const deriveEncryptionKey = async (password: string): Promise<Buffer> => {
    const hash = await webcrypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    return Buffer.from(hash.slice(0, 32));
};

export const requestSignature = async (req: Request, res: Response) => {
  const { payloadToSign, password } = req.body; // O frontend envia o payload e a senha (temporariamente para descripto)
  const userId = req.user?.id;

  if (!userId) {
    auditLog(null, 'SIGN_REQUEST_UNAUTH', `Signature request without authenticated user from IP: ${req.ip}`);
    return res.status(401).send('Unauthorized: User not identified.');
  }
  if (!payloadToSign || !password) {
      auditLog(userId, 'SIGN_REQUEST_INVALID_DATA', `Missing payload or password for signing for user ${userId}.`);
      return res.status(400).send('Payload to sign and password are required.');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { privateKeyEnc: true, password: true }, // Buscar senha hash para verificar e descripto
    });

    if (!user || !user.privateKeyEnc) {
      auditLog(userId, 'SIGN_REQUEST_NO_PRIVATE_KEY', `User ${userId} attempting signature but no private key found.`);
      return res.status(404).send('User private key not found.');
    }

    // AQUI: Validar a senha para descriptografar a chave privada
    // Em um sistema real, a senha não seria enviada para cada assinatura.
    // Usaria-se uma chave de sessão ou um token de curta duração para autorizar a operação de assinatura.
    // Para a simulação, estamos enviando a senha para demonstrar a descriptografia.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        auditLog(userId, 'SIGN_REQUEST_INVALID_PASSWORD', `Invalid password for signing by user ${userId}.`);
        return res.status(401).send('Invalid password for signing operation.');
    }

    const [ivBase64, encryptedDataB64] = user.privateKeyEnc.split('.');
    if (!ivBase64 || !encryptedDataB64) {
        auditLog(userId, 'SIGN_REQUEST_MALFORMED_KEY', `Malformed encrypted private key for user ${userId}.`);
        return res.status(500).send('Malformed encrypted private key.');
    }

    // Derivar a chave de criptografia da senha fornecida
    const encryptionKeyMaterial = await deriveEncryptionKey(password);

    // Descriptografar a chave privada
    const privateKeyJwk = await decryptKey(ivBase64, encryptedDataB64, encryptionKeyMaterial);

    // Assinar o payload
    const signature = await signPayload(privateKeyJwk, payloadToSign);

    auditLog(userId, 'PAYLOAD_SIGNED', `Payload signed successfully for user ${userId}.`);
    res.status(200).json({ signature });
  } catch (error: any) {
    console.error('Error requesting signature:', error);
    auditLog(userId, 'SIGN_REQUEST_ERROR', `Error signing payload for user ${userId}: ${error.message}`);
    res.status(500).send('Error processing signature request.');
  }
};
