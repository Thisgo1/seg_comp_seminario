import {
	CreateOrderDto,
	LoginDto,
	NewAddressDto,
	ProviderType,
	RegisterDto,
	UpdateAddressDto,
	UpdateOrderStatusDto,
	UpdateUserDto,
	CreateRatingDto,
	BrazilianProduct,
	EuropeanProduct,
	UnifiedProduct,
} from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
const PROVIDER_URLS = {
	brazilian:
		"http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider",
	european:
		"http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider",
};

const authFetch = async (
	url: string,
	options: RequestInit = {},
	token?: string
) => {
	const headers = {
		"Content-Type": "application/json",
		...(token && { Authorization: `Bearer ${token}` }),
		...options.headers,
	};

	try {
		const res = await fetch(`${API_BASE_URL}${url}`, {
			...options,
			headers,
			credentials: "include",
		});

		// Tratamento especial para status 401 (não autorizado)
		if (res.status === 401) {
			localStorage.removeItem("token");
			throw new Error("Não autorizado - sessão expirada");
		}

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			const errorMessage =
				errorData.message || `Erro ${res.status} na requisição`;
			throw new Error(errorMessage);
		}

		return await res.json();
	} catch (error) {
		console.error(`Erro na requisição para ${url}:`, error);
		throw error;
	}
};

const publicFetch = async <T>(url: string): Promise<T> => {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error(`Fetch failed for ${url}:`, error);
		throw new Error(`Failed to fetch data from ${url}`);
	}
};

export const api = {
	// APIs dos providers
	providers: {
		getBrazilian: async (): Promise<BrazilianProduct[]> => {
			return publicFetch<BrazilianProduct[]>(PROVIDER_URLS.brazilian);
		},

		getEuropean: async (): Promise<EuropeanProduct[]> => {
			return publicFetch<EuropeanProduct[]>(PROVIDER_URLS.european);
		},

		getAll: async (): Promise<UnifiedProduct[]> => {
			try {
				const [brasilianProducts, europeanProducts] = await Promise.all([
					api.providers.getBrazilian(),
					api.providers.getEuropean(),
				]);

				const unified: UnifiedProduct[] = [
					...brasilianProducts.map((p) => ({
						id: p.id,
						name: p.nome,
						description: p.descricao,
						price: p.preco,
						image: p.imagem,
						provider: "BRASILIAN" as ProviderType,
						material: p.material,
						category: p.categoria,
					})),
					...europeanProducts.map((p) => ({
						id: p.id,
						name: p.name,
						description: p.description,
						price: p.price,
						image: p.gallery[0] || "",
						provider: "EUROPEAN" as ProviderType,
						hasDiscount: p.hasDiscount,
						discountValue: p.discountValue,
						material: p.details.material,
					})),
				];

				return unified;
			} catch (error) {
				console.error("Erro ao unificar produtos:", error);
				throw error;
			}
		},
	},
	// Autenticação
	auth: {
		signup: async (userData: RegisterDto) =>
			authFetch("/auth/signup", {
				method: "POST",
				body: JSON.stringify(userData),
			}),

		signin: async (credentials: LoginDto) =>
			authFetch("/auth/signin", {
				method: "POST",
				body: JSON.stringify(credentials),
			}),

		logout: async () => authFetch("/auth/logout", { method: "POST" }),
	},

	// Usuário
	user: {
		getMe: async (token: string) =>
			authFetch("/users/me", { method: "GET" }, token),

		update: async (dto: UpdateUserDto, token: string) =>
			authFetch(
				"/users",
				{ method: "PATCH", body: JSON.stringify(dto) },
				token
			),

		delete: async (token: string) =>
			authFetch("/users", { method: "DELETE" }, token),
	},

	// Endereços
	addresses: {
		getAll: async (token: string) =>
			authFetch("/addresses", { method: "GET" }, token),

		getById: async (addressId: number, token: string) =>
			authFetch(`/addresses/${addressId}`, { method: "GET" }, token),

		create: async (dto: NewAddressDto, token: string) =>
			authFetch(
				"/addresses",
				{ method: "POST", body: JSON.stringify(dto) },
				token
			),

		update: async (addressId: number, dto: UpdateAddressDto, token: string) =>
			authFetch(
				`/addresses/${addressId}`,
				{ method: "PUT", body: JSON.stringify(dto) },
				token
			),

		delete: async (addressId: number, token: string) =>
			authFetch(`/addresses/${addressId}`, { method: "DELETE" }, token),
	},

	// Pedidos
	orders: {
		create: async (dto: CreateOrderDto, token: string) =>
			authFetch(
				"/orders",
				{ method: "POST", body: JSON.stringify(dto) },
				token
			),

		getAll: async (token: string) =>
			authFetch("/orders", { method: "GET" }, token),

		getById: async (orderId: number, token: string) => {
			const order = await authFetch(
				`/orders/${orderId}`,
				{ method: "GET" },
				token
			);

			return {
				...order,
				items: order.items.map((item: any) => ({
					...item,
					product: {
						id: item.productId,
						name: item.productName,
						price: item.price,
						imageUrl: item.productImage || "/placeholder-product.jpg",
					},
				})),
			};
		},

		updateStatus: async (
			orderId: number,
			dto: UpdateOrderStatusDto,
			token: string
		) =>
			authFetch(
				`/orders/${orderId}/status`,
				{ method: "PUT", body: JSON.stringify(dto) },
				token
			),

		cancel: async (orderId: number, token: string) =>
			authFetch(`/orders/${orderId}/cancel`, { method: "PUT" }, token),
	},

	// Produtos
	products: {
		getAll: async (page = 1, limit = 10, token: string) =>
			authFetch(
				`/products?page=${page}&limit=${limit}`,
				{ method: "GET" },
				token
			),

		getById: async (provider: ProviderType, id: string, token: string) =>
			authFetch(`/products/${provider}/${id}`, { method: "GET" }, token),

		search: async (query: string, token: string) =>
			authFetch(`/products/search?q=${query}`, { method: "GET" }, token),

		getHistory: async (provider: ProviderType, id: string, token: string) =>
			authFetch(
				`/products/${provider}/${id}/history`,
				{ method: "GET" },
				token
			),

		compare: async (orderItemId: number, token: string) =>
			authFetch(`/products/compare/${orderItemId}`, { method: "GET" }, token),
	},

	ratings: {
		/**
		 * Avalia um produto
		 * @param productId ID do produto na API externa
		 * @param provider Tipo do provedor (BRASILIAN/EUROPEAN)
		 * @param dto Dados da avaliação
		 * @param token JWT token
		 */
		rateProduct: async (
			productId: string,
			provider: ProviderType,
			dto: CreateRatingDto,
			token: string
		) =>
			authFetch(
				`/products/${provider}/${id}/rate`,
				{ method: "POST", body: JSON.stringify(dto) },
				token
			),

		/**
		 * Busca avaliações de um produto
		 * @param productId ID do produto
		 * @param provider Tipo do provedor
		 * @param page Página atual (opcional)
		 * @param limit Itens por página (opcional)
		 * @param token JWT token (opcional para rotas públicas)
		 */
		getProductRatings: async (
			productId: string,
			provider: ProviderType,
			page: number = 1,
			limit: number = 10,
			token?: string
		) =>
			authFetch(
				`/products/${provider}/${id}/ratings?page=${page}&limit=${limit}`,
				{ method: "GET" },
				token
			),

		/**
		 * Deleta uma avaliação do usuário
		 * @param ratingId ID da avaliação
		 * @param token JWT token
		 */
		deleteRating: async (ratingId: number, token: string) =>
			authFetch(`/ratings/${ratingId}`, { method: "DELETE" }, token),
	},
};
