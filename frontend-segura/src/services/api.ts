const API_BASE_URL = "https://localhost:3443/api";

interface ApiResponse<T> {
	ok: boolean;
	data: T | null;
	message?: string;
	errors?: string[];
}

// Função genérica para fazer requisições à API
async function apiRequest<T>(
	endpoint: string,
	method: string,
	body?: any,
	token?: string | null
): Promise<ApiResponse<T>> {
	const headers: HeadersInit = {
		"Content-Type": "application/json",
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		});

		// --- ADIÇÃO PARA TRATAR RESPOSTAS NÃO-JSON ---
		const contentType = response.headers.get("content-type");
		let data: any = null;
		if (contentType && contentType.includes("application/json")) {
			// Se a resposta é JSON, tenta parsear
			data = await response.json();
		} else {
			// Se a resposta NÃO é JSON, leia como texto e crie uma mensagem de erro
			const text = await response.text();
			console.warn(`Resposta não-JSON de ${endpoint}:`, text);
			return {
				ok: response.ok,
				data: null,
				message: `Erro do servidor: ${response.status} ${
					response.statusText
				}. Detalhes: ${text.substring(0, 100)}...`,
				errors: [text],
			};
		}
		// --- FIM DA ADIÇÃO ---

		if (response.ok) {
			return { ok: true, data: data as T, message: data.message };
		} else {
			// Se a resposta não for ok, mas for JSON, use a mensagem do JSON
			return {
				ok: false,
				data: null,
				message: data.message || "Ocorreu um erro.",
				errors: data.errors,
			};
		}
	} catch (error: any) {
		console.error(`Erro na requisição para ${endpoint}:`, error);
		return {
			ok: false,
			data: null,
			message: `Erro de conexão: ${error.message}`,
		};
	}
}

// Funções específicas para cada endpoint
export const auth = {
	register: (email: string, password: string) =>
		apiRequest<{ message: string; userId: string }>("/auth/register", "POST", {
			email,
			password,
		}),
	login: (email: string, password: string) =>
		apiRequest<{
			message: string;
			token: string;
			user: { id: string; email: string; publicKey: JsonWebKey };
		}>("/auth/login", "POST", { email, password }),
};

export const purchase = {
	signPayload: (payloadToSign: any, password: string, token: string) =>
		apiRequest<{ signature: string }>(
			"/sign-payload",
			"POST",
			{ payloadToSign, password },
			token
		),
	createPurchase: (payload: any, signature: string, token: string) =>
		apiRequest<{ message: string; purchase: any }>(
			"/purchase",
			"POST",
			{ payload, signature },
			token
		),
};
