import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

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
		publicKey: string,
		payload: any,
		signature: string
	): Promise<boolean> {
		// 1. Verifica se o payload tem timestamp válido
		if (!payload.timestamp || typeof payload.timestamp !== "number") {
			throw new Error("Invalid timestamp in payload");
		}

		// 2. Ordena campos do payload para consistência
		const orderedPayload = Object.keys(payload)
			.sort()
			.reduce((obj, key) => {
				obj[key] = payload[key];
				return obj;
			}, {});

		// 3. Verificação da assinatura
		const verifier = crypto.createVerify("SHA256");
		verifier.update(JSON.stringify(orderedPayload));

		return verifier.verify(
			{ key: publicKey, format: "pem" },
			signature,
			"base64"
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
			.replace("-----BEGIN PUBLIC KEY-----", "")
			.replace("-----END PUBLIC KEY-----", "")
			.replace(/\s+/g, "");

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
