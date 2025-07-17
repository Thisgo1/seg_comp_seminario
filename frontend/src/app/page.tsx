"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import { ProductListItem } from "@/components/products/ProductListItem";
import { HorizontalProductCarousel } from "@/components/products/HorizontalProductCarousel";
import { MOCK_PRODUCTS } from "@/data/mockProduct";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	PaginationEllipsis,
} from "@/components/ui/pagination";

export default function ProductsPage() {
	const [showMock, setShowMock] = useState(false);

	// Use o hook atualizado
	const {
		products,
		loading,
		error,
		newProducts,
		bestSellingProducts,
		currentPage,
		totalPages,
		totalProducts,
		goToPage,
		search,
		searchQuery,
		itemsPerPage,
		updateItemsPerPage, // Recebemos o searchQuery do hook
	} = useProducts();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
	};

	const handleSearch = () => {
		search(searchQuery);
	};

	const triggerSearch = () => {
		search(searchQuery);
	};

	// Resetar para a primeira página quando mudar o número de itens por página
	useEffect(() => {
		goToPage(1);
	}, [itemsPerPage, goToPage]);

	return (
		<main>
			<div className="container mx-auto px-4 py-8">
				<div className="mb-24">
					<Header />
				</div>

				{/* Seção de Novos Produtos */}
				<section className="mb-16">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">Novos Produtos</h1>
						<Button variant="link" className="text-primary">
							Ver todos
						</Button>
					</div>

					{loading ? (
						<CarouselSkeleton />
					) : (
						<HorizontalProductCarousel
							products={newProducts.map((p) => ({
								id: p.id,
								name: p.name,
								price: parseFloat(p.price),
								averageRating: p.averageRating || 4.0,
								ratingCount: p.ratingCount || 0,
								imageUrl: p.image || "/placeholder-product.jpg",
							}))}
						/>
					)}
				</section>

				{/* Seção de Produtos Mais Vendidos */}
				<section className="mb-16">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">Produtos Mais Vendidos</h1>
						<Button variant="link" className="text-primary">
							Ver todos
						</Button>
					</div>

					{loading ? (
						<CarouselSkeleton />
					) : (
						<HorizontalProductCarousel
							products={bestSellingProducts.map((p) => ({
								id: p.id,
								name: p.name,
								price: parseFloat(p.price),
								averageRating: p.averageRating || 4.0,
								ratingCount: p.ratingCount || 0,
								imageUrl: p.image || "/placeholder-product.jpg",
							}))}
						/>
					)}
				</section>

				{/* Seção de Todos os Produtos */}
				<section>
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
						<h1 className="text-3xl font-bold">Todos os Produtos</h1>

						<div className="flex flex-col md:flex-row items-end gap-4 w-full md:w-auto">
							{/* Info de paginação */}
							<div className="text-sm text-gray-600">
								Página {currentPage} de {totalPages} • {totalProducts} produtos
							</div>

							{/* Seletor de itens por página */}
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-600">Itens por página:</span>
								<select
									value={itemsPerPage}
									onChange={(e) => updateItemsPerPage(Number(e.target.value))}
									className="border rounded-md px-2 py-1 text-sm"
								>
									<option value="10">10</option>
									<option value="20">20</option>
									<option value="50">50</option>
								</select>
							</div>

							{/* Barra de busca */}
							<div className="flex gap-2 w-full md:w-64">
								<Input
									placeholder="Buscar produtos..."
									value={searchQuery}
									onChange={(e) => search(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSearch()}
								/>
								<Button onClick={handleSearch}>Buscar</Button>
							</div>
						</div>
					</div>

					{!loading && products.length === 0 && (
						<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
							<div className="flex">
								<div className="ml-3">
									<p className="text-sm text-yellow-700">
										{searchQuery
											? `Nenhum produto encontrado com o termo "${searchQuery}"`
											: "Estamos exibindo produtos de exemplo. Nenhum produto real foi encontrado."}
									</p>
								</div>
							</div>
						</div>
					)}

					{loading ? (
						<ProductsGridSkeleton />
					) : products.length === 0 ? (
						<NoProducts showMock={() => setShowMock(true)} />
					) : (
						<>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
								{products.map((product) => (
									<ProductListItem
										key={`${product.provider}-${product.id}`}
										product={{
											id: product.id,
											name: product.name,
											price: parseFloat(product.price),
											averageRating: product.averageRating || 4.0,
											ratingCount: product.ratingCount || 0,
											imageUrl: product.image || "/placeholder-product.jpg",
										}}
									/>
								))}
							</div>

							{/* Controles de paginação */}
							{totalPages > 1 && (
								<div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
									<div className="text-sm text-gray-600">
										Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
										{Math.min(currentPage * itemsPerPage, totalProducts)} de{" "}
										{totalProducts} produtos
									</div>

									<Pagination>
										<PaginationContent>
											<PaginationItem>
												<PaginationPrevious
													onClick={() => goToPage(currentPage - 1)}
													disabled={currentPage === 1}
												/>
											</PaginationItem>

											{/* Números de página */}
											{Array.from(
												{ length: Math.min(5, totalPages) },
												(_, i) => {
													const startPage = Math.max(
														1,
														Math.min(totalPages - 4, currentPage - 2)
													);
													const pageNum = startPage + i;

													if (pageNum > totalPages) return null;

													return (
														<PaginationItem key={pageNum}>
															<PaginationLink
																onClick={() => goToPage(pageNum)}
																isActive={pageNum === currentPage}
															>
																{pageNum}
															</PaginationLink>
														</PaginationItem>
													);
												}
											)}

											{currentPage < totalPages - 3 && totalPages > 5 && (
												<PaginationItem>
													<PaginationEllipsis />
												</PaginationItem>
											)}

											<PaginationItem>
												<PaginationNext
													onClick={() => goToPage(currentPage + 1)}
													disabled={currentPage === totalPages}
												/>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</div>
							)}
						</>
					)}

					{showMock && (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
							{MOCK_PRODUCTS.map((product) => (
								<ProductListItem
									key={product.id}
									product={{
										id: product.id,
										name: product.name,
										price: product.price,
										averageRating: product.averageRating,
										ratingCount: product.ratingCount,
										imageUrl: product.imageUrl,
									}}
								/>
							))}
						</div>
					)}
				</section>
			</div>
		</main>
	);
}

// Componentes auxiliares
const CarouselSkeleton = () => (
	<div className="flex space-x-4 overflow-hidden">
		{Array.from({ length: 4 }).map((_, index) => (
			<div key={index} className="flex-shrink-0 w-56">
				<Skeleton className="w-full h-[174px] rounded-lg" />
				<Skeleton className="h-4 w-full mt-2" />
				<Skeleton className="h-4 w-3/4 mt-1" />
				<Skeleton className="h-6 w-1/2 mt-2" />
			</div>
		))}
	</div>
);

const ProductsGridSkeleton = () => (
	<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
		{Array.from({ length: 8 }).map((_, index) => (
			<div key={index} className="border rounded-lg overflow-hidden">
				<Skeleton className="w-full h-[174px]" />
				<div className="p-3">
					<Skeleton className="h-4 w-full mb-2" />
					<Skeleton className="h-4 w-3/4 mb-2" />
					<Skeleton className="h-6 w-1/2" />
				</div>
			</div>
		))}
	</div>
);

const NoProducts = ({ showMock }: { showMock: () => void }) => (
	<div className="text-center py-12">
		<p className="text-lg text-gray-600">Nenhum produto encontrado.</p>
		<Button className="mt-4" onClick={showMock}>
			Ver produtos de exemplo
		</Button>
	</div>
);
