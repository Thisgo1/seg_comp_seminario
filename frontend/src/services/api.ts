// src/services/api.ts
import axios from "axios";

// Configuração base do Axios
const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api", // substitua pela URL da sua API
	headers: {
		"Content-Type": "application/json",
	},
});

function getCSRFToken() {
	const name = "XSRF-TOKEN=";
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookieArray = decodedCookie.split(";");

	for (let i = 0; i < cookieArray.length; i++) {
		let cookie = cookieArray[i];
		while (cookie.charAt(0) === " ") {
			cookie = cookie.substring(1);
		}
		if (cookie.indexOf(name) === 0) {
			return cookie.substring(name.length, cookie.length);
		}
	}
	return "";
}

api.interceptors.request.use(async (config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
    // Tenta obter o token CSRF do cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    } else {
      // Se não tiver cookie, faz uma requisição para obter o token
      const { data } = await api.get('/csrf/token');
      config.headers['X-CSRF-TOKEN'] = data.csrfToken;
    }
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 403 && error.response.data.message === 'Invalid CSRF Token') {
      // Token CSRF inválido - obtém um novo e repete a requisição
      const { data } = await api.get('/csrf/token');
      error.config.headers['X-CSRF-TOKEN'] = data.csrfToken;
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

type UserData = {
	email: string;
	password: string;
};

type ItemData = {
	itemId: string;
	quantity?: number;
};

export const apiService = {
	
	// Autenticação
	async register(userData: { email: string; password: string; name?: string }) {
		const response = await api.post("/auth/register", userData);
		return response.data;
	},

	async login(credentials: { email: string; password: string }) {
		const response = await api.post("/auth/login", credentials);
		return response.data; // Tokens estarão em cookies HttpOnly
	},

	async logout() {
		await api.post("/auth/logout");
		// Redireciona após logout
		window.location.href = "/login";
	},

	// Comprar item
	async purchaseItem(itemData: { itemId: string; quantity?: number }) {
		const response = await api.post("/purchase", itemData);
		return response.data;
	},
};

export default api;
