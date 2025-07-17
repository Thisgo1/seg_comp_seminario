import Link from "next/link";
import { StarRating } from "../ratings";

interface Product {
	id: string;
	name: string;
	price: number;
	averageRating: number;
	ratingCount: number;
	imageUrl?: string;
}

interface ProductListItemProps {
	product: Product;
}

export function ProductListItem({ product }: ProductListItemProps) {
	return (
		<Link
			href={`/products/${product.id}`}
			className="block group transition-transform hover:scale-[1.02]"
		>
			<div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
				{/* Imagem do Produto */}
				<div className="relative w-full h-[174px] bg-gray-100">
					<img
						src={product.imageUrl || "/placeholder-product.jpg"}
						alt={product.name}
						className="object-contain"
					/>
				</div>

				{/* Informações do Produto */}
				<div className="p-3">
					<h1 className="font-medium text-base mb-1 line-clamp-2 h-[2.5rem]">
						{product.name}
					</h1>

					<div className="flex items-center mb-1">
						<StarRating rating={product.averageRating} size="sm" />
						<span className="ml-1 text-xs text-gray-600">
							({product.ratingCount})
						</span>
					</div>

					<h2 className="text-lg font-semibold">${product.price.toFixed(2)}</h2>
				</div>
			</div>
		</Link>
	);
}
