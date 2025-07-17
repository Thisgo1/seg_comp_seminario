// Tipos compartilhados entre frontend/backend
export type ProviderType = "BRASILIAN" | "EUROPEAN";
export type OrderStatus =
	| "PENDING"
	| "PROCESSING"
	| "COMPLETED"
	| "CANCELLED"
	| "REFUNDED";

export type LoginDto = {
	email: string;
	password: string;
};

export type RegisterDto = {
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
};

export type UpdateUserDto = {
	firstName?: string;
	lastName?: string;
	image?: string;
};

export type NewAddressDto = {
	street: string;
	city: string;
	state: string;
	postalCode: string;
	number: number;
	complement?: string;
	isDefault?: boolean;
};

export type UpdateAddressDto = Partial<NewAddressDto>;

export type CreateOrderDto = {
	items: {
		productId: string;
		name: string;
		price: number;
		quantity: number;
		provider: ProviderType;
		imageUrl?: string;
		description?: string;
	}[];
	addressId: number;
	paymentMethod: "CREDIT_CARD" | "PIX" | "PAYPAL";
};

export type UpdateOrderStatusDto = {
	status: OrderStatus;
};

export type CreateRatingDto = {
	rating: number;
	comment?: string;
};

export type ProductRating = {
	id: number;
	productId: string;
	provider: ProviderType;
	userId: number;
	rating: number;
	comment?: string;
	createdAt: string;
	user: {
		firstName: string;
		lastName: string;
	};
};

export type BrazilianProduct = {
	nome: string;
	descricao: string;
	categoria: string;
	imagem: string;
	preco: string;
	material: string;
	departamento: string;
	id: string;
};

export type EuropeanProduct = {
	hasDiscount: boolean;
	name: string;
	gallery: string[];
	description: string;
	price: string;
	discountValue: string;
	details: {
		adjective: string;
		material: string;
	};
	id: string;
};

export interface UnifiedProduct {
	id: string;
	name: string;
	description: string;
	price: string;
	image: string;
	provider: ProviderType;
	material?: string;
	category?: string;
	hasDiscount?: boolean;
	discountValue?: string;

	// Novas propriedades adicionadas
	averageRating?: number;
	ratingCount?: number;
	fullDescription?: string;
}
