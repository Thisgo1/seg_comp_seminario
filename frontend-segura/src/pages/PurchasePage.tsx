import React, { useState } from "react";
import { mockProducts, Product } from "../data/products";
import ProductCard from "../components/ProductCard";
import PurchaseForm from "../components/PurchaseForm";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

interface PurchasePageProps {
	setMessage: (msg: string | null, type: "success" | "error" | null) => void;
}

const PurchasePage: React.FC<PurchasePageProps> = ({ setMessage }) => {
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const { logout } = useAuth();

	const handleProductSelection = (product: Product) => {
		console.log("Produto selecionado:", product); // DEBUG LOG 1: Verifica qual produto foi clicado
		setSelectedProduct(product);
		setMessage(null, null); // Limpa mensagens anteriores ao selecionar um produto
		console.log("selectedProduct após setSelectedProduct:", product); // DEBUG LOG 2: Verifica o estado atualizado
	};

	const handlePurchaseSuccess = () => {
		console.log("Compra bem-sucedida, voltando para a lista de produtos."); // DEBUG LOG 3
		setSelectedProduct(null); // Volta para a lista de produtos após a compra
	};

	// DEBUG LOG 4: Verifica o valor de selectedProduct a cada render
	console.log(
		"PurchasePage renderizando. selectedProduct é:",
		selectedProduct ? selectedProduct.name : "null"
	);

	return (
		<div className="w-full">
			{selectedProduct ? (
				<PurchaseForm
					selectedProduct={selectedProduct}
					setMessage={setMessage}
					onPurchaseSuccess={handlePurchaseSuccess}
				/>
			) : (
				<div className="bg-white p-8 rounded-xl shadow-lg w-full">
					<h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
						Nossos Produtos
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{mockProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onSelectProduct={handleProductSelection} // Garante que a prop está sendo passada
							/>
						))}
					</div>
					<Button
						onClick={logout}
						variant="destructive"
						className="mt-8 w-full max-w-xs mx-auto block"
					>
						Sair
					</Button>
				</div>
			)}
		</div>
	);
};

export default PurchasePage;
