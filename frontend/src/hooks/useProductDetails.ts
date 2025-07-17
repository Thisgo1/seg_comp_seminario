import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { ProviderType, UnifiedProduct } from "@/types/types";

export const useProductDetails = (provider: ProviderType, id: string) => {
	const [product, setProduct] = useState<UnifiedProduct | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<UnifiedProduct[]>([]);
	const [ratings, setRatings] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isMock, setIsMock] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// 1. Buscar detalhes do produto
				const [allProducts] = await Promise.all([
					api.providers.getAll().catch(() => []),
				]);

				const foundProduct = allProducts.find(
					(p) => p.id === id && p.provider === provider
				);

				if (!foundProduct) {
					setIsMock(true);
					// Criar mock de produto
					setProduct({
						id,
						name: "Produto Demonstrativo",
						description: "Descrição demonstrativa do produto",
						price: "99.99",
						image: "/placeholder-product.jpg",
						provider,
						material: "Material demonstrativo",
						category: "Categoria demonstrativa",
						averageRating: 4.5,
						ratingCount: 100,
						fullDescription: "Descrição completa demonstrativa do produto",
					});

					// Criar mock de avaliações
					setRatings([
						{
							id: "1",
							user: { name: "Usuário Demonstrativo" },
							rating: 5,
							comment: "Excelente produto demonstrativo!",
							createdAt: new Date().toISOString(),
						},
					]);

					// Gerar produtos relacionados mockados
					setRelatedProducts(
						allProducts
							.filter((p) => p.id !== id)
							.slice(0, 4)
							.map((p) => ({
								...p,
								averageRating: Math.random() * 2 + 3,
								ratingCount: Math.floor(Math.random() * 100),
							}))
					);
				} else {
					setProduct(foundProduct);
					setIsMock(false);

					// Buscar avaliações (mockado neste exemplo)
					setRatings([
						{
							id: "1",
							user: { name: "Cliente Satisfeito" },
							rating: 4,
							comment: "Bom produto, entrega rápida",
							createdAt: new Date().toISOString(),
						},
						{
							id: "2",
							user: { name: "Comprador Feliz" },
							rating: 5,
							comment: "Superou minhas expectativas!",
							createdAt: new Date().toISOString(),
						},
					]);

					// Gerar produtos relacionados reais
					setRelatedProducts(
						allProducts
							.filter(
								(p) => p.id !== id && p.category === foundProduct.category
							)
							.slice(0, 4)
					);
				}
			} catch (err) {
				setError("Erro ao carregar detalhes do produto");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [provider, id]);

	return {
		product,
		relatedProducts,
		ratings,
		loading,
		error,
		isMock,
	};
};
