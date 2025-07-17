// src/app/orders/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { getToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Truck,
	CreditCard,
	MapPin,
	Calendar,
	Package,
	CheckCircle,
} from "lucide-react";
import Link from "next/link";

function OrderItem({ item }: { item: any }) {
	return (
		<div className="flex items-start gap-4 py-4 border-b border-gray-200">
			<div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
				<img
					src={item.product.imageUrl}
					alt={item.product.name}
					className="object-contain w-full h-full"
				/>
			</div>

			<div className="flex-1 min-w-0">
				<h3 className="font-medium text-base line-clamp-2 mb-1">
					{item.product.name}
				</h3>

				<div className="text-sm text-gray-600 mb-2">
					<p>Quantidade: {item.quantity}</p>
				</div>

				<div className="flex justify-between items-center">
					<span className="font-semibold text-base">
						R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
					</span>
					<span className="text-sm text-gray-500">
						R$ {item.price.toFixed(2).replace(".", ",")} cada
					</span>
				</div>
			</div>
		</div>
	);
}

export default function OrderPage() {
	const params = useParams();
	const orderId = params.id;
	const [order, setOrder] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const token = getToken();

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				if (!token) {
					setError("Usuário não autenticado");
					setLoading(false);
					return;
				}

				const orderData = await api.orders.getById(Number(orderId), token);
				setOrder(orderData);
			} catch (err) {
				setError("Erro ao carregar pedido");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrder();
	}, [orderId, token]);

	const Clock = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	);

	// Função para traduzir status
	const getStatusInfo = (status: string) => {
		switch (status) {
			case "PENDING":
				return {
					text: "Pagamento Pendente",
					color: "bg-yellow-100 text-yellow-800",
					icon: <Clock className="w-4 h-4" />,
				};
			case "PREPARING":
				return {
					text: "Preparando Envio",
					color: "bg-blue-100 text-blue-800",
					icon: <Package className="w-4 h-4" />,
				};
			case "SHIPPED":
				return {
					text: "A Caminho",
					color: "bg-purple-100 text-purple-800",
					icon: <Truck className="w-4 h-4" />,
				};
			case "DELIVERED":
				return {
					text: "Entregue",
					color: "bg-green-100 text-green-800",
					icon: <CheckCircle className="w-4 h-4" />,
				};
			default:
				return {
					text: status,
					color: "bg-gray-100 text-gray-800",
					icon: null,
				};
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Skeleton className="h-8 w-64 mb-6" />
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex items-start gap-4 py-4 border-b border-gray-200"
						>
							<Skeleton className="w-24 h-24 rounded-md" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-4 w-1/3" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<p className="text-red-500 mb-4">{error}</p>
				<Button asChild>
					<Link href="/orders">Voltar para meus pedidos</Link>
				</Button>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="container mx-auto px-4 py-8 text-center">
				<p className="mb-4">Pedido não encontrado</p>
				<Button asChild>
					<Link href="/orders">Voltar para meus pedidos</Link>
				</Button>
			</div>
		);
	}

	const statusInfo = getStatusInfo(order.status);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<Link
					href="/orders"
					className="inline-flex items-center text-primary hover:underline"
				>
					&larr; Voltar para meus pedidos
				</Link>
			</div>

			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
				<h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
				<Badge className={`${statusInfo.color} px-3 py-1 text-sm font-medium`}>
					<div className="flex items-center gap-1">
						{statusInfo.icon}
						{statusInfo.text}
					</div>
				</Badge>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Coluna 1: Itens do pedido */}
				<div className="lg:col-span-2">
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<h2 className="text-lg font-semibold mb-4">Itens do Pedido</h2>
						<div className="divide-y">
							{order.items.map((item: any) => (
								<OrderItem key={item.id} item={item} />
							))}
						</div>

						{/* Resumo do pedido */}
						<div className="border-t pt-4 mt-4">
							<div className="flex justify-between py-2">
								<span>Subtotal</span>
								<span>R$ {order.subtotal.toFixed(2).replace(".", ",")}</span>
							</div>
							<div className="flex justify-between py-2">
								<span>Frete</span>
								<span>R$ {order.shippingFee.toFixed(2).replace(".", ",")}</span>
							</div>
							{order.discount > 0 && (
								<div className="flex justify-between py-2">
									<span>Desconto</span>
									<span className="text-green-600">
										- R$ {order.discount.toFixed(2).replace(".", ",")}
									</span>
								</div>
							)}
							<div className="flex justify-between py-2 font-bold text-lg mt-2">
								<span>Total</span>
								<span>R$ {order.total.toFixed(2).replace(".", ",")}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Coluna 2: Informações do pedido */}
				<div className="space-y-6">
					{/* Endereço de entrega */}
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<MapPin className="w-5 h-5" /> Endereço de Entrega
						</h2>
						<div className="text-gray-700">
							<p className="font-medium">
								{order.shippingAddress?.title || "Endereço Principal"}
							</p>
							<p>
								{order.shippingAddress?.street}, {order.shippingAddress?.number}
								{order.shippingAddress?.complement &&
									`, ${order.shippingAddress.complement}`}
							</p>
							<p>
								{order.shippingAddress?.neighborhood} -{" "}
								{order.shippingAddress?.city}/{order.shippingAddress?.state}
							</p>
							<p>CEP: {order.shippingAddress?.zipCode}</p>
						</div>
					</div>

					{/* Informações de pagamento */}
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<CreditCard className="w-5 h-5" /> Pagamento
						</h2>
						<div className="text-gray-700">
							<p>
								<span className="font-medium">Método:</span>{" "}
								{order.payment.method}
							</p>
							{order.payment.method === "CREDIT_CARD" && (
								<p>
									<span className="font-medium">Cartão:</span> **** **** ****{" "}
									{order.payment.last4Digits}
								</p>
							)}
							<p>
								<span className="font-medium">Status:</span>{" "}
								{order.payment.status === "PAID" ? "Pago" : "Pendente"}
							</p>
						</div>
					</div>

					{/* Detalhes do pedido */}
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<Calendar className="w-5 h-5" /> Detalhes do Pedido
						</h2>
						<div className="text-gray-700 space-y-2">
							<p>
								<span className="font-medium">Data do pedido:</span>{" "}
								{new Date(order.createdAt).toLocaleDateString()}
							</p>
							{order.updatedAt && (
								<p>
									<span className="font-medium">Última atualização:</span>{" "}
									{new Date(order.updatedAt).toLocaleDateString()}
								</p>
							)}
							{order.trackingCode && (
								<p>
									<span className="font-medium">Código de rastreio:</span>{" "}
									{order.trackingCode}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Ações para pedidos pendentes */}
			{order.status === "PENDING" && (
				<div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<div>
							<h3 className="font-medium text-lg">
								Seu pedido aguarda pagamento
							</h3>
							<p className="text-yellow-700">
								Complete o pagamento para processarmos seu pedido
							</p>
						</div>
						<Button className="bg-yellow-600 hover:bg-yellow-700">
							Concluir Pagamento
						</Button>
					</div>
				</div>
			)}

			{/* Ações para pedidos entregues */}
			{order.status === "DELIVERED" && (
				<div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<div>
							<h3 className="font-medium text-lg">
								Pedido entregue com sucesso!
							</h3>
							<p className="text-green-700">
								Como foi sua experiência com os produtos?
							</p>
						</div>
						<Button
							variant="outline"
							className="border-green-600 text-green-600"
						>
							Avaliar Produtos
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
