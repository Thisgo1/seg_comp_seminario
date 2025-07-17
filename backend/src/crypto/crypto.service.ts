import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  /**
   * Verifica uma assinatura digital
   * @param publicKeyPem Chave pública em formato PEM
   * @param payload Dados originais
   * @param signatureBase64 Assinatura em base64
   * @returns boolean indicando se a assinatura é válida
   */
  async verifySignature(
    publicKeyPem: string,
    payload: any,
    signatureBase64: string
  ): Promise<boolean> {
    // Importa a chave pública para o formato da Web Crypto API
    const publicKey = await this.importPublicKey(publicKeyPem);
    
    // Decodifica a assinatura de base64 para ArrayBuffer
    const signature = this.base64ToArrayBuffer(signatureBase64);
    
    // Converte o payload para ArrayBuffer
    const data = new TextEncoder().encode(JSON.stringify(payload));
    
    // Verifica a assinatura
    return crypto.subtle.verify(
      { name: "ECDSA", hash: { name: "SHA-256" } },
      publicKey,
      signature,
      data
    );
  }

  /**
   * Converte uma chave pública PEM para CryptoKey
   * @param pem Chave no formato PEM
   * @returns CryptoKey pronta para verificação
   */
  private async importPublicKey(pem: string): Promise<CryptoKey> {
    // Remove cabeçalhos/footers PEM e espaços
    const pemContents = pem
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s+/g, '');
    
    // Decodifica de base64 para ArrayBuffer
    const binaryDer = this.base64ToArrayBuffer(pemContents);
    
    // Importa a chave usando a Web Crypto API
    return crypto.subtle.importKey(
      "spki", // Formato Standard Public Key Infrastructure
      binaryDer,
      { name: "ECDSA", namedCurve: "P-256" },
      true, // Chave exportável?
      ["verify"] // Permissões (apenas verificação)
    );
  }

  /**
   * Converte base64 para ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}
