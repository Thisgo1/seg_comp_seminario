"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Counter from "@/components/Counter";
import { StarRating, RatingList } from "@/components/ratings/index";
import { api } from "@/services/api";
import { ProviderType } from "@/types/types";
import { ProductCarousel } from "@/components/products/ProductsCarousel";
import useCart from "@/hooks/useCart";

// Mock básico para um produto
const MOCK_PRODUCT = {
	id: "mock-product",
	name: "Produto Demonstrativo",
	price: 199.99,
	description: "Descrição resumida do produto demonstrativo",
	fullDescription:
		"Esta é uma descrição completa do produto demonstrativo. Aqui você pode incluir todas as informações detalhadas sobre o produto, suas características técnicas, materiais utilizados, cuidados especiais e qualquer outro detalhe relevante para o consumidor.\n\nEste produto é apenas um exemplo para demonstração da interface.",
	provider: "BRASILIAN" as ProviderType,
	averageRating: 4.5,
	ratingCount: 12,
	imageUrl: "/placeholder-product.jpg",
	category: "eletronicos",
};

// Mock para avaliações
const MOCK_RATINGS = [
	{
		id: 1,
		user: "Cliente Satisfeito",
		rating: 5,
		comment: "Produto excelente, superou minhas expectativas!",
		date: "2023-10-15",
	},
	{
		id: 2,
		user: "Comprador Anônimo",
		rating: 4,
		comment: "Bom produto, entrega rápida. Recomendo!",
		date: "2023-10-10",
	},
];

// Mock para produtos do carrossel
const MOCK_PRODUCTS = [
	{
		id: "mock-1",
		name: "Produto Similar 1",
		price: 189.99,
		description: "Descrição do produto similar 1",
		provider: "BRASILIAN" as ProviderType,
		averageRating: 4.3,
		ratingCount: 8,
		imageUrl: "/placeholder-product.jpg",
		category: "eletronicos",
	},
	{
		id: "mock-2",
		name: "Produto Similar 2",
		price: 219.5,
		description: "Descrição do produto similar 2",
		provider: "BRASILIAN" as ProviderType,
		averageRating: 4.7,
		ratingCount: 15,
		imageUrl: "/placeholder-product.jpg",
		category: "eletronicos",
	},
	{
		id: "mock-3",
		name: "Produto Similar 3",
		price: 159.99,
		description: "Descrição do produto similar 3",
		provider: "EUROPEAN" as ProviderType,
		averageRating: 4.0,
		ratingCount: 6,
		imageUrl: "/placeholder-product.jpg",
		category: "eletronicos",
	},
	{
		id: "mock-4",
		name: "Produto Similar 4",
		price: 249.99,
		description: "Descrição do produto similar 4",
		provider: "BRASILIAN" as ProviderType,
		averageRating: 4.8,
		ratingCount: 20,
		imageUrl: "/placeholder-product.jpg",
		category: "eletronicos",
	},
];

interface Product {
	id: string;
	name: string;
	price: number;
	description: string;
	fullDescription: string;
	provider: ProviderType;
	averageRating: number;
	ratingCount: number;
	imageUrl?: string;
	category: string;
}

export default function ProductDetailsPage({
	params,
}: {
	params: { id: string };
}) {
	const { addToCart } = useCart();
	const [product, setProduct] = useState<Product | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [ratings, setRatings] = useState<any[]>([]);
	const [activeTab, setActiveTab] = useState<"description" | "reviews">(
		"description"
	);
	const [loading, setLoading] = useState(true);
	const [isMock, setIsMock] = useState(false);
	const [quantity, setQuantity] = useState(1);

	// Busca os dados do produto e avaliações
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setIsMock(false);
				const provider: ProviderType = "BRASILIAN";

				// Busca os dados do produto
				const productData = await api.products.getById(
					provider,
					params.id,
					"user-token"
				);
				setProduct(productData);

				// Busca as avaliações do produto
				const ratingsData = await api.ratings.getProductRatings(
					params.id,
					provider,
					1,
					10,
					"user-token"
				);
				setRatings(ratingsData);

				// Busca produtos para o carrossel
				const productsData = await api.products.getAll(1, 20, "user-token");
				setProducts(productsData.items || []);
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
				// Em caso de erro, usar dados mockados
				setProduct(MOCK_PRODUCT);
				setRatings(MOCK_RATINGS);
				setProducts(MOCK_PRODUCTS);
				setIsMock(true);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [params.id]);

	const handleAddToCart = () => {
		if (!product) return;

		addToCart({
			id: product.id,
			name: product.name,
			price: product.price,
			quantity: quantity,
			imageUrl: product.imageUrl,
		});

		// Feedback visual
		alert(`${quantity} ${product.name} adicionado(s) ao carrinho!`);
	};

	if (loading) {
		return (
			<main className="flex flex-col min-h-screen">
				<Header />
				<div className="flex-1 flex items-center justify-center">
					<p>Carregando detalhes do produto...</p>
				</div>
			</main>
		);
	}

	if (!product) {
		return (
			<main className="flex flex-col min-h-screen">
				<Header />
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<p className="text-lg mb-4">Produto não encontrado</p>
						<Button
							onClick={() => {
								setProduct(MOCK_PRODUCT);
								setRatings(MOCK_RATINGS);
								setProducts(MOCK_PRODUCTS);
								setIsMock(true);
							}}
						>
							Ver produto demonstrativo
						</Button>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="flex flex-col min-h-screen">
			<Header />

			{/* Breadcrumbs */}
			<section className="px-4 py-2 mt-22">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="/products">Produtos</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>
								{product.name} {isMock && "(Demonstração)"}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</section>

			{/* Banner de demonstração */}
			{isMock && (
				<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 my-2">
					<div className="flex">
						<div className="ml-3">
							<p className="text-sm text-yellow-700">
								Você está visualizando um produto demonstrativo com dados
								fictícios.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Conteúdo Principal */}
			<section className="flex-1 px-4 pb-20">
				{/* Imagem do Produto */}
				<div className="relative w-full h-64 mb-4 bg-gray-100 rounded-lg">
					<img
						src={product.imageUrl || "/placeholder-product.jpg"}
						alt={product.name}
						className="object-contain"
						priority
					/>
					{isMock && (
						<div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
							<span className="bg-white bg-opacity-80 text-sm px-3 py-1 rounded">
								Imagem Demonstrativa
							</span>
						</div>
					)}
				</div>

				{/* Informações do Produto */}
				<div className="mb-6">
					<h1 className="text-2xl font-bold mb-1">
						{product.name}{" "}
						{isMock && (
							<span className="text-sm text-gray-500">(Demonstração)</span>
						)}
					</h1>

					{/* Ratings - Média */}
					<div className="flex items-center mb-2">
						<StarRating rating={product.averageRating} size="sm" />
						<span className="ml-2 text-sm text-gray-600">
							({product.ratingCount} avaliações)
						</span>
					</div>

					<h2 className="text-xl font-semibold mb-3">
						${product.price.toFixed(2)}
					</h2>
					<p className="text-gray-700 mb-4">{product.description}</p>

					<div className="h-px bg-gray-200 my-4"></div>
				</div>

				{/* Contador e Botão */}
				<div className="flex items-center gap-3 mb-8">
					<Counter value={quantity} onChange={setQuantity} min={1} max={10} />
					<Button
						className="flex-1"
						onClick={handleAddToCart}
						disabled={isMock}
					>
						{isMock ? "Produto demonstrativo" : "Adicionar ao carrinho"}
					</Button>
				</div>

				{/* Abas de Navegação */}
				<div className="flex border-b border-gray-200 mb-4">
					<button
						className={`py-2 px-4 font-medium transition-colors duration-200 ${
							activeTab === "description"
								? "text-primary border-b-2 border-primary"
								: "text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("description")}
					>
						Descrição
					</button>
					<button
						className={`py-2 px-4 font-medium transition-colors duration-200 ${
							activeTab === "reviews"
								? "text-primary border-b-2 border-primary"
								: "text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("reviews")}
					>
						Avaliações ({product.ratingCount})
					</button>
				</div>

				{/* Conteúdo das Abas */}
				<div className="mt-4">
					{activeTab === "description" && (
						<div className="prose max-w-none">
							<h3 className="text-lg font-semibold mb-2">Descrição Completa</h3>
							<p className="text-gray-700 whitespace-pre-line">
								{product.fullDescription}
							</p>

							{/* Características */}
							<div className="mt-6">
								<h4 className="font-medium mb-2">Características:</h4>
								<ul className="list-disc pl-5 space-y-1">
									<li>Material: 100% algodão</li>
									<li>Dimensões: 30cm x 40cm</li>
									<li>Peso: 250g</li>
									<li>Cores disponíveis: Preto, Branco, Azul</li>
									{isMock && (
										<li className="text-gray-500">
											Este produto é apenas para demonstração
										</li>
									)}
								</ul>
							</div>
						</div>
					)}

					{activeTab === "reviews" && (
						<div>
							<h3 className="text-lg font-semibold mb-4">Avaliações</h3>

							{isMock && (
								<div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
									<p className="text-sm text-blue-700">
										Avaliações demonstrativas com dados fictícios.
									</p>
								</div>
							)}

							<RatingList ratings={ratings} isMock={isMock} />
						</div>
					)}

					{/* Carrossel de produtos recomendados */}
					<div className="mt-12">
						<h2 className="text-xl font-bold mb-4">Produtos Recomendados</h2>
						{isMock && (
							<p className="text-sm text-gray-500 mb-4">
								Produtos similares demonstrativos
							</p>
						)}
						<ProductCarousel
							products={products}
							currentProductId={product.id}
							isMock={isMock}
						/>
					</div>
				</div>
			</section>
		</main>
	);
}
