// src/components/products/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { StarRating } from "../ratings";

interface Product {
	id: string;
	name: string;
	price: number;
	description?: string;
	imageUrl?: string;
	averageRating: number;
	category?: string;
}

interface ProductCardProps {
	product: Product;
	isMock?: boolean;
}

export function ProductCard({ product, isMock = false }: ProductCardProps) {
	return (
		<div
			className={`border rounded-lg overflow-hidden shadow-sm ${
				isMock ? "opacity-75" : "hover:shadow-md transition-shadow"
			}`}
		>
			<Link href={isMock ? "#" : `/products/${product.id}`}>
				<div className="relative aspect-square">
					<img
						src={product.imageUrl || "/placeholder-product.jpg"}
						alt={product.name}
						className="object-cover"
					/>
					{isMock && (
						<div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
							<span className="bg-white bg-opacity-80 text-xs px-2 py-1 rounded">
								Exemplo
							</span>
						</div>
					)}
				</div>
				<div className="p-4">
					<h3 className="font-medium mb-1 line-clamp-2">{product.name}</h3>
					<div className="flex items-center mb-2">
						<StarRating rating={product.averageRating} size="sm" />
					</div>
					<p className="text-lg font-semibold">${product.price.toFixed(2)}</p>

					{isMock && (
						<p className="text-xs text-gray-500 mt-2">Produto demonstrativo</p>
					)}
				</div>
			</Link>
		</div>
	);
}
