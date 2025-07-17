import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/services/api";
import { UnifiedProduct } from "@/types/types";

export const useProducts = (initialItemsPerPage: number = 10) => {
	const [allProducts, setAllProducts] = useState<UnifiedProduct[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<UnifiedProduct[]>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
	const [searchQuery, setSearchQuery] = useState("");

	// Carregar produtos
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const products = await api.providers.getAll();
				setAllProducts(products);
				setFilteredProducts(products);
			} catch (err) {
				setError("Erro ao carregar produtos");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	// Calcular produtos para os carrosseis
	const newProducts = useMemo(() => {
		return [...allProducts]
			.sort(
				(a, b) =>
					new Date(b.createdAt || 0).getTime() -
					new Date(a.createdAt || 0).getTime()
			)
			.slice(0, 10);
	}, [allProducts]);

	const bestSellingProducts = useMemo(() => {
		return [...allProducts]
			.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0))
			.slice(0, 10);
	}, [allProducts]);

	// Calcular produtos paginados
	const { displayedProducts, totalPages, totalProducts } = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		const total = filteredProducts.length;
		const pages = Math.ceil(total / itemsPerPage);

		return {
			displayedProducts: filteredProducts.slice(startIndex, endIndex),
			totalPages: pages,
			totalProducts: total,
		};
	}, [filteredProducts, currentPage, itemsPerPage]);

	// Função de busca
	const search = useCallback(
		(query: string) => {
			setSearchQuery(query);
			setCurrentPage(1);

			if (query.trim() === "") {
				setFilteredProducts(allProducts);
				return;
			}

			const filtered = allProducts.filter(
				(product) =>
					product.name.toLowerCase().includes(query.toLowerCase()) ||
					(product.description &&
						product.description.toLowerCase().includes(query.toLowerCase()))
			);

			setFilteredProducts(filtered);
		},
		[allProducts]
	);

	// Função estável para mudar de página
	const goToPage = useCallback(
		(page: number) => {
			if (page >= 1 && page <= totalPages) {
				setCurrentPage(page);
			}
		},
		[totalPages]
	);

	// Atualizar itemsPerPage
	const updateItemsPerPage = useCallback((newItemsPerPage: number) => {
		setItemsPerPage(newItemsPerPage);
		setCurrentPage(1); // Resetar para a primeira página
	}, []);

	return {
		products: displayedProducts,
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
		updateItemsPerPage,
	};
};
