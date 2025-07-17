"use client";
import Header from "@/components/Header";
import CartItem from "@/components/products/CartItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useCart from "@/hooks/useCart";
import { useState } from "react";

export default function Cart() {
	const {
		cart,
		itemCount,
		cartTotal,
		removeFromCart,
		updateQuantity,
		clearCart,
	} = useCart();

	const [couponCode, setCouponCode] = useState("");
	const [discount, setDiscount] = useState(0);

	// Cálculos
	const subtotal = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const shippingFee = subtotal > 200 ? 0 : 15.9;
	const total = subtotal + shippingFee - discount;

	const applyCoupon = () => {
		if (couponCode.toUpperCase() === "DESCONTO10") {
			setDiscount(subtotal * 0.1); // 10% de desconto
		} else {
			setDiscount(0);
			alert("Cupom inválido ou expirado");
		}
	};

	return (
		<main className="min-h-screen flex flex-col">
			<Header />

			{/* Breadcrumb */}
			<div className="container mx-auto px-4 py-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Carrinho</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{/* Conteúdo principal */}
			<div className="container mx-auto px-4 py-6 flex-1 flex flex-col md:flex-row gap-8">
				{/* Seção de itens do carrinho */}
				<section className="md:w-2/3">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-2xl font-bold">Seu Carrinho ({itemCount})</h1>
						{cart.length > 0 && (
							<Button
								variant="link"
								className="text-destructive"
								onClick={clearCart}
							>
								Limpar carrinho
							</Button>
						)}
					</div>

					{cart.length === 0 ? (
						<div className="text-center py-12">
							<div className="bg-gray-100 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
								{/* Ícone de carrinho vazio */}
							</div>
							<h2 className="text-xl font-semibold mb-2">
								Seu carrinho está vazio
							</h2>
							<p className="text-gray-600 mb-6">
								Adicione produtos para continuar
							</p>
							<Button asChild>
								<a href="/products">Continuar Comprando</a>
							</Button>
						</div>
					) : (
						<div className="bg-white rounded-lg shadow-sm border">
							{cart.map((item) => (
								<CartItem key={item.id} item={item} />
							))}

							<div className="p-4 border-t flex justify-end">
								<Button variant="outline" asChild>
									<a href="/products">Continuar Comprando</a>
								</Button>
							</div>
						</div>
					)}
				</section>

				{/* Seção de resumo da compra (apenas se houver itens) */}
				{cart.length > 0 && (
					<section className="md:w-1/3">
						<div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
							<h2 className="text-xl font-bold mb-6">Resumo da Compra</h2>

							<div className="space-y-4 mb-6">
								<div className="flex justify-between">
									<span>Subtotal</span>
									<span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
								</div>

								<div className="flex justify-between">
									<span>Desconto</span>
									<span className="text-green-600">
										- R$ {discount.toFixed(2).replace(".", ",")}
									</span>
								</div>

								<div className="flex justify-between">
									<span>Taxa de Entrega</span>
									<span>
										{shippingFee > 0
											? `R$ ${shippingFee.toFixed(2).replace(".", ",")}`
											: "Grátis"}
									</span>
								</div>

								<div className="h-px bg-gray-200 my-2"></div>

								<div className="flex justify-between font-bold text-lg">
									<span>Total</span>
									<span>R$ {total.toFixed(2).replace(".", ",")}</span>
								</div>
							</div>

							<div className="mb-6">
								<label
									className="block text-sm font-medium mb-2"
									htmlFor="coupon"
								>
									Adicionar cupom
								</label>
								<div className="flex gap-2">
									<Input
										id="coupon"
										placeholder="Código do cupom"
										value={couponCode}
										onChange={(e) => setCouponCode(e.target.value)}
									/>
									<Button
										variant="secondary"
										onClick={applyCoupon}
										disabled={!couponCode.trim()}
									>
										Aplicar
									</Button>
								</div>
							</div>

							<Button
								className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
								asChild
							>
								<a href="/checkout">Finalizar Compra</a>
							</Button>

							{subtotal > 0 && subtotal < 200 && (
								<div className="mt-4 text-center text-sm text-green-600 bg-green-50 p-2 rounded">
									Adicione mais R${" "}
									{(200 - subtotal).toFixed(2).replace(".", ",")} para frete
									grátis!
								</div>
							)}
						</div>
					</section>
				)}
			</div>
		</main>
	);
}
