import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { StarRating } from "@/components/ratings";
import Link from "next/link";

interface Product {
	id: string;
	name: string;
	price: number;
	imageUrl: string;
	averageRating: number;
	category: string;
}

interface ProductCarouselProps {
	products: Product[];
	currentProductId: string;
}

// Mock data para quando não houver produtos recomendados
const MOCK_PRODUCTS: Product[] = [
	{
		id: "mock-1",
		name: "Produto Similar 1",
		price: 89.9,
		imageUrl: "/placeholder-product.jpg",
		averageRating: 4.5,
		category: "default",
	},
	{
		id: "mock-2",
		name: "Produto Similar 2",
		price: 120.0,
		imageUrl: "/placeholder-product.jpg",
		averageRating: 4.2,
		category: "default",
	},
	{
		id: "mock-3",
		name: "Produto Similar 3",
		price: 75.5,
		imageUrl: "/placeholder-product.jpg",
		averageRating: 4.0,
		category: "default",
	},
	{
		id: "mock-4",
		name: "Produto Similar 4",
		price: 199.9,
		imageUrl: "/placeholder-product.jpg",
		averageRating: 4.7,
		category: "default",
	},
];

export function ProductCarousel({
	products,
	currentProductId,
}: ProductCarouselProps) {
	// Filtra o produto atual e pega apenas produtos da mesma categoria
	const currentProduct = products.find((p) => p.id === currentProductId);
	const recommendedProducts = products.filter(
		(p) => p.id !== currentProductId && p.category === currentProduct?.category
	);

	// Usa os produtos recomendados ou o mock se não houver recomendações
	const displayProducts =
		recommendedProducts.length > 0 ? recommendedProducts : MOCK_PRODUCTS;

	// Não mostra o carrossel se não houver produtos (nem mock)
	if (displayProducts.length === 0) {
		return null;
	}

	return (
		<div className="mt-12">
			<h2 className="text-2xl font-bold mb-6">Você também pode gostar</h2>
			<Carousel className="w-full">
				<CarouselContent>
					{displayProducts.map((product) => (
						<CarouselItem
							key={product.id}
							className="md:basis-1/2 lg:basis-1/3"
						>
							<div className="p-2">
								{product.id.startsWith("mock-") ? (
									<Card>
										<CardContent className="flex flex-col items-center p-4">
											<div className="relative w-full h-48 mb-4">
												<img
													src={product.imageUrl}
													alt={product.name}
													className="object-contain opacity-75"
												/>
											</div>
											<h3 className="font-medium text-center mb-2 line-clamp-2">
												{product.name}
											</h3>
											<div className="flex items-center mb-2">
												<StarRating rating={product.averageRating} size="sm" />
											</div>
											<p className="text-lg font-semibold">
												${product.price.toFixed(2)}
											</p>
										</CardContent>
									</Card>
								) : (
									<Link href={`/products/${product.id}`}>
										<Card className="hover:shadow-lg transition-shadow">
											<CardContent className="flex flex-col items-center p-4">
												<div className="relative w-full h-48 mb-4">
													<img
														src={product.imageUrl || "/placeholder-product.jpg"}
														alt={product.name}
														className="object-contain"
													/>
												</div>
												<h3 className="font-medium text-center mb-2 line-clamp-2">
													{product.name}
												</h3>
												<div className="flex items-center mb-2">
													<StarRating
														rating={product.averageRating}
														size="sm"
													/>
												</div>
												<p className="text-lg font-semibold">
													${product.price.toFixed(2)}
												</p>
											</CardContent>
										</Card>
									</Link>
								)}
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="hidden md:flex" />
				<CarouselNext className="hidden md:flex" />
			</Carousel>

			{recommendedProducts.length === 0 && (
				<p className="text-sm text-gray-500 text-center mt-2">
					Mostrando sugestões genéricas
				</p>
			)}
		</div>
	);
}
