import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';
import { auditLog } from './auditService';
import { generateKeyPair, encryptKey } from './cryptoService'; // Novas importações
import { webcrypto } from 'crypto'; // Para gerar chave para criptografar privada

const saltRounds = 10;

// Esta função simulará uma chave de criptografia derivada da senha.
// Em um sistema real, você usaria PBKDF2 ou Argon2 para derivar uma chave robusta
// e NUNCA usaria a senha diretamente.
const deriveEncryptionKey = async (password: string): Promise<Buffer> => {
  // Simplificação: apenas hash da senha para gerar uma chave AES para criptografar a chave privada.
  // Em produção, use um KDF (Key Derivation Function) forte como PBKDF2 ou Argon2.
  const hash = await webcrypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Buffer.from(hash.slice(0, 32)); // Usar os primeiros 32 bytes para uma chave AES-256
};

export const registerUser = async (email: string, passwordPlain: string) => {
  const hashedPassword = await bcrypt.hash(passwordPlain, saltRounds);

  try {
    // Gerar par de chaves assimétricas
    const { publicKeyJwk, privateKeyJwk } = await generateKeyPair();

    // Derivar uma chave de criptografia da senha do usuário
    const encryptionKeyMaterial = await deriveEncryptionKey(passwordPlain);

    // Criptografar a chave privada
    const { iv, encryptedData } = await encryptKey(privateKeyJwk, encryptionKeyMaterial);
    const encryptedPrivateKey = `${iv}.${encryptedData}`; // Armazenar IV junto com os dados criptografados

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        publicKey: JSON.stringify(publicKeyJwk),
        privateKeyEnc: encryptedPrivateKey,
      },
    });
    auditLog(newUser.id, 'REGISTER', `User ${newUser.email} registered successfully.`);
    return newUser;
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target.includes('email')) {
      auditLog(null, 'REGISTER_FAIL', `Attempt to register with existing email: ${email}`);
      throw new Error('Email already registered');
    }
    auditLog(null, 'REGISTER_FAIL', `Failed to register user ${email}. Error: ${error.message}`);
    throw error;
  }
};

export const loginUser = async (email: string, passwordPlain: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    auditLog(null, 'LOGIN_FAIL', `Login attempt for non-existent email: ${email}`);
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(passwordPlain, user.password);

  if (!isPasswordValid) {
    auditLog(user.id, 'LOGIN_FAIL', `Failed login attempt for user: ${email} (incorrect password)`);
    throw new Error('Invalid credentials');
  }

  // Aqui você pode descriptografar a chave privada e armazená-la TEMPORARIAMENTE
  // em um cache de servidor (ex: Redis) associada ao ID da sessão, ou
  // passá-la para um serviço de assinatura que a gerenciará.
  // Para simplicidade deste exemplo, vamos apenas indicar que ela seria acessível
  // para operações de assinatura.
  // IMPORTANTE: Não retorne a chave privada ao frontend.

  const token = generateToken(user.id, user.email);
  auditLog(user.id, 'LOGIN_SUCCESS', `User ${user.email} logged in successfully.`);
  // Retornar a chave pública para o frontend, se necessário para verificação local ou exibição
  return { user: { id: user.id, email: user.email, publicKey: JSON.parse(user.publicKey) }, token };
};
