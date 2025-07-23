// src/services/cryptoService.ts
import { webcrypto } from 'crypto';
// import { JWKOutput } from 'webcrypto-core'; // REMOVIDO: Não exporta JWKOutput diretamente

// JsonWebKey é o tipo padrão para JWK na Web Crypto API
// Não precisamos importar de webcrypto-core para isso.

// Função para gerar um par de chaves RSA
export const generateKeyPair = async () => {
  const keyPair = await webcrypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-V1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    true, // Chaves exportáveis
    ["sign", "verify"]
  );

  const publicKeyJwk = await webcrypto.subtle.exportKey("jwk", keyPair.publicKey) as JsonWebKey; // USANDO JsonWebKey
  const privateKeyJwk = await webcrypto.subtle.exportKey("jwk", keyPair.privateKey) as JsonWebKey; // USANDO JsonWebKey

  return { publicKeyJwk, privateKeyJwk };
};

// Função para criptografar uma chave (simulando com AES-GCM e uma chave derivada da senha)
// Para produção, NUNCA use a senha diretamente para derivar a chave de criptografia.
// Use um algoritmo de derivação de chave robusto como PBKDF2 ou Argon2.
// Para este exemplo acadêmico, vamos simplificar para focar na lógica.
export const encryptKey = async (
  keyToEncryptJwk: JsonWebKey, // USANDO JsonWebKey
  encryptionKeyMaterial: Buffer
): Promise<{ iv: string, encryptedData: string }> => {
  const iv = webcrypto.getRandomValues(new Uint8Array(16)); // Initialization Vector
  const algorithm = { name: "AES-GCM", iv: iv };
  const importedEncryptionKey = await webcrypto.subtle.importKey(
    "raw",
    encryptionKeyMaterial,
    algorithm.name,
    false,
    ["encrypt"]
  );

  const encrypted = await webcrypto.subtle.encrypt(
    algorithm,
    importedEncryptionKey,
    new TextEncoder().encode(JSON.stringify(keyToEncryptJwk))
  );

  return {
    iv: Buffer.from(iv).toString('base64'),
    encryptedData: Buffer.from(encrypted).toString('base64'),
  };
};

// Função para descriptografar uma chave
export const decryptKey = async (
  ivBase64: string,
  encryptedDataB64: string,
  decryptionKeyMaterial: Buffer
): Promise<JsonWebKey> => { // USANDO JsonWebKey
  const iv = Buffer.from(ivBase64, 'base64');
  const encryptedData = Buffer.from(encryptedDataB64, 'base64');
  const algorithm = { name: "AES-GCM", iv: iv };
  const importedDecryptionKey = await webcrypto.subtle.importKey(
    "raw",
    decryptionKeyMaterial,
    algorithm.name,
    false,
    ["decrypt"]
  );

  const decrypted = await webcrypto.subtle.decrypt(
    algorithm,
    importedDecryptionKey,
    encryptedData
  );

  return JSON.parse(new TextDecoder().decode(decrypted)) as JsonWebKey; // USANDO JsonWebKey
};

// Função para assinar um payload com a chave privada
export const signPayload = async (
  privateKeyJwk: JsonWebKey, // USANDO JsonWebKey
  payload: any
): Promise<string> => {
  const importedPrivateKey = await webcrypto.subtle.importKey(
    "jwk",
    privateKeyJwk,
    { name: "RSASSA-PKCS1-V1_5", hash: "SHA-256" },
    false, // Não exportável
    ["sign"]
  );

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));

  const signature = await webcrypto.subtle.sign(
    { name: "RSASSA-PKCS1-V1_5" },
    importedPrivateKey,
    data
  );

  return Buffer.from(signature).toString('base64');
};

// Função para verificar uma assinatura (mantém-se igual)
export const verifyDigitalSignature = async (
  publicKeyJwk: string,
  payload: any,
  signatureBase64: string
): Promise<boolean> => {
  try {
    const publicKey: JsonWebKey = JSON.parse(publicKeyJwk);

    const importedPublicKey = await webcrypto.subtle.importKey(
      "jwk",
      publicKey,
      { name: "RSASSA-PKCS1-V1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload));
    const signature = Buffer.from(signatureBase64, 'base64');

    const isValid = await webcrypto.subtle.verify(
      { name: "RSASSA-PKCS1-V1_5" },
      importedPublicKey,
      signature,
      data
    );

    return isValid;
  } catch (error) {
    console.error("Erro ao verificar assinatura digital:", error);
    return false;
  }
};
