"use client";

import { useState } from "react";
import Header from "@/components/Header";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Counter from "@/components/Counter";
import { StarRating, RatingList } from "@/components/ratings/index";
import { ProviderType } from "@/types/types";
import { useParams } from "next/navigation";
import { ProductCarousel } from "@/components/products/ProductsCarousel";
import useCart from "@/hooks/useCart";
import { useProductDetails } from "@/hooks/useProductDetails";
import { toast } from "sonner"; // Importe para feedback visual

export default function ProductDetailsPage() {
	const params = useParams();
	const provider = (params.provider || "BRASILIAN") as ProviderType;
	const id = params.id || "1";

	const { product, relatedProducts, ratings, loading, error, isMock } =
		useProductDetails(provider, id);
	const { addToCart } = useCart();
	const [activeTab, setActiveTab] = useState<"description" | "reviews">(
		"description"
	);
	const [quantity, setQuantity] = useState(1);

	const handleAddToCart = () => {
		// Verificar se a quantidade é válida
		if (quantity < 1) {
			toast.error("A quantidade deve ser pelo menos 1");
			return;
		}

		if (!product) return;

		addToCart({
			id: product.id,
			name: product.name,
			price: parseFloat(product.price),
			quantity: quantity,
			imageUrl: product.image,
		});

		toast.success(`${quantity} ${product.name} adicionado(s) ao carrinho!`);
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
						<Button onClick={() => window.location.reload()}>
							Tentar novamente
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
				{/* Imagem do Produto - Corrigido usando Image do Next.js */}
				<div className="relative w-full h-64 mb-4 bg-gray-100 rounded-lg">
					<img
						src={product.image || "/placeholder-product.jpg"}
						alt={product.name}
						className="object-contain"
						// priority={true} // Removido ou ajustado conforme necessidade
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
						{product.name}
						{isMock && (
							<span className="text-sm text-gray-500"> (Demonstração)</span>
						)}
					</h1>

					<div className="flex items-center mb-2">
						<StarRating rating={product.averageRating || 4.5} size="sm" />
						<span className="ml-2 text-sm text-gray-600">
							({product.ratingCount || 0} avaliações)
						</span>
					</div>

					<h2 className="text-xl font-semibold mb-3">
						R$ {parseFloat(product.price).toFixed(2)}
					</h2>
					<p className="text-gray-700 mb-4">{product.description}</p>

					<div className="h-px bg-gray-200 my-4"></div>
				</div>

				{/* Contador e Botão */}
				<div className="flex items-center gap-3 mb-8">
					<Counter
						value={quantity}
						onChange={(newValue) => {
							// Garantir que o valor não seja menor que 1
							setQuantity(Math.max(1, newValue));
						}}
						min={0}
						max={10}
					/>
					<Button
						className="flex-1"
						onClick={handleAddToCart}
						disabled={isMock || quantity < 1} // Desabilitar se quantidade < 1
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
						Avaliações ({product.ratingCount || 0})
					</button>
				</div>

				{/* Conteúdo das Abas */}
				<div className="mt-4">
					{activeTab === "description" && (
						<div className="prose max-w-none">
							<h3 className="text-lg font-semibold mb-2">Descrição Completa</h3>
							<p className="text-gray-700 whitespace-pre-line">
								{product.fullDescription ||
									"Descrição detalhada não disponível."}
							</p>

							{/* Características */}
							<div className="mt-6">
								<h4 className="font-medium mb-2">Características:</h4>
								<ul className="list-disc pl-5 space-y-1">
									<li>Categoria: {product.category || "Não especificada"}</li>
									<li>Material: {product.material || "Não especificado"}</li>
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

							<RatingList ratings={ratings} />
						</div>
					)}

					{/* Carrossel de produtos recomendados */}
					{relatedProducts.length > 0 && (
						<div className="mt-12">
							<h2 className="text-xl font-bold mb-4">Produtos Relacionados</h2>
							<ProductCarousel
								products={relatedProducts.map((p) => ({
									id: p.id,
									name: p.name,
									price: parseFloat(p.price),
									averageRating: p.averageRating || 4.0,
									ratingCount: p.ratingCount || 0,
									imageUrl: p.image || "/placeholder-product.jpg",
								}))}
							/>
						</div>
					)}
				</div>
			</section>
		</main>
	);
}
