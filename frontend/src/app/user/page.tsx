"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	CreditCard,
	MapPin,
	Gift,
	Package,
	Truck,
	Star,
	WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useUserData } from "@/hooks/useUserData";
import { useUserOrders } from "@/hooks/useUserOrders";
import { useUserAddresses } from "@/hooks/useUserAddresses";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/lib/auth";

// Dados mockados
const mockUser = {
	name: "João Silva",
	email: "joao.silva@example.com",
};

const mockOrders = [
	{ id: "ORD001", status: "PENDING", items: 2, total: 149.9 },
	{ id: "ORD002", status: "PREPARING", items: 1, total: 89.9 },
	{ id: "ORD003", status: "SHIPPED", items: 3, total: 259.8 },
	{ id: "ORD004", status: "TO_REVIEW", items: 2, total: 120.0 },
];

const mockWallet = [
	{
		id: "CPN001",
		type: "coupon",
		title: "10% de desconto",
		code: "DESCONTO10",
		valid: "31/12/2023",
	},
	{ id: "PMT001", type: "payment", title: "Cartão Mastercard", last4: "1234" },
	{
		id: "CPN002",
		type: "coupon",
		title: "Frete grátis",
		code: "FRETEGRATIS",
		valid: "30/11/2023",
	},
	{ id: "PMT002", type: "payment", title: "Cartão Visa", last4: "5678" },
];

const mockAddresses = [
	{
		id: "ADD001",
		title: "Casa",
		address: "Rua das Flores, 123 - São Paulo/SP",
	},
	{
		id: "ADD002",
		title: "Trabalho",
		address: "Av. Paulista, 1000 - São Paulo/SP",
	},
];

export default function User() {
	const { user, loading: userLoading } = useUserData();
	const { orders, loading: ordersLoading } = useUserOrders();
	const { addresses, loading: addressesLoading } = useUserAddresses();
	const router = useRouter();
	const token = getToken();

	useEffect(() => {
		if (!token) {
			router.push("/auth/login");
		}
	}, [token, router]);

	const getStatusInfo = (status: string) => {
		switch (status) {
			case "PENDING":
				return {
					text: "Pagamento Pendente",
					icon: <WalletCards className="w-5 h-5" />,
					color: "bg-yellow-100 text-yellow-800",
				};
			case "PREPARING":
				return {
					text: "Preparando Envio",
					icon: <Package className="w-5 h-5" />,
					color: "bg-blue-100 text-blue-800",
				};
			case "SHIPPED":
				return {
					text: "A Caminho",
					icon: <Truck className="w-5 h-5" />,
					color: "bg-purple-100 text-purple-800",
				};
			case "TO_REVIEW":
				return {
					text: "Avaliar Produtos",
					icon: <Star className="w-5 h-5" />,
					color: "bg-green-100 text-green-800",
				};
			default:
				return { text: status, icon: null, color: "bg-gray-100 text-gray-800" };
		}
	};
	console.log(user);
	console.log(orders);

	if (userLoading || ordersLoading || addressesLoading) {
		return (
			<main className="container mx-auto px-4 py-8">
				<div className="space-y-6">
					<Skeleton className="h-12 w-64" />

					{/* Skeleton para pedidos */}
					<div className="space-y-4">
						<Skeleton className="h-8 w-48" />
						<div className="flex gap-4 overflow-x-auto pb-4">
							{[1, 2, 3, 4].map((i) => (
								<Card key={i} className="min-w-[280px]">
									<CardHeader>
										<Skeleton className="h-6 w-32" />
									</CardHeader>
									<CardContent>
										<Skeleton className="h-4 w-full mb-2" />
										<Skeleton className="h-4 w-3/4 mb-4" />
										<Skeleton className="h-10 w-full" />
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Skeleton para carteira */}
					{/* ... similar ao de pedidos ... */}

					{/* Skeleton para endereços */}
					<div className="space-y-4">
						<Skeleton className="h-8 w-48" />
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{[1, 2].map((i) => (
								<Card key={i}>
									<CardHeader>
										<Skeleton className="h-6 w-32" />
									</CardHeader>
									<CardContent>
										<Skeleton className="h-4 w-full mb-2" />
										<Skeleton className="h-4 w-full mb-2" />
										<Skeleton className="h-4 w-3/4 mb-4" />
										<div className="flex gap-2">
											<Skeleton className="h-8 w-20" />
											<Skeleton className="h-8 w-20" />
										</div>
									</CardContent>
								</Card>
							))}
							<Skeleton className="h-64 rounded-lg" />
						</div>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<div className="flex gap-16">
					<div>
						<h1 className="text-3xl font-bold">
							Olá, {user?.firstName || "Usuário"}
						</h1>
						<p className="text-gray-600">{user?.email}</p>
					</div>
					<Link href={"/"}>
						<img
							src="https://in8.com.br/wp-content/themes/bootscore-child-main/img/logo.svg"
							alt="Logo da In8"
							className="h-12"
						/>
					</Link>
				</div>
			</div>

			{/* Seção: Minhas Compras */}
			<section className="mb-10">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold flex items-center gap-2">
						<Package className="w-5 h-5" /> Minhas Compras
					</h2>
					<Button variant="link" asChild>
						<Link href="/orders">Ver todas</Link>
					</Button>
				</div>

				{orders.length === 0 ? (
					<div className="text-center py-8">
						<Package className="w-12 h-12 mx-auto text-gray-400" />
						<p className="mt-2 text-gray-600">Nenhum pedido encontrado</p>
					</div>
				) : (
					<div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
						{orders.slice(0, 4).map((order) => {
						console.log(order)
							const statusInfo = getStatusInfo(order.status);
							return (
								<Link
									href={`/orders/${order.id}`}
									key={order.id}
									className="min-w-[280px] flex-shrink-0"
								>
									<Card className="h-full transition-transform hover:scale-[1.02]">
										<CardHeader className="pb-2">
											<div className="flex justify-between items-start">
												<CardTitle className="text-lg">
													Pedido #{order.id}
												</CardTitle>
												<Badge className={statusInfo.color}>
													{statusInfo.icon}
													<span className="ml-1">{statusInfo.text}</span>
												</Badge>
											</div>
										</CardHeader>
										<CardContent>
											<div className="flex justify-between text-sm mb-2">
												<span>
													{order.items.length}{" "}
													{order.items.length > 1 ? "itens" : "item"}
												</span>
												<span className="font-semibold">
													R$ {order.total.toFixed(2)}
												</span>
											</div>
											<Button variant="outline" className="w-full mt-2">
												Ver detalhes
											</Button>
										</CardContent>
									</Card>
								</Link>
							);
						})}
					</div>
				)}
			</section>

			{/* Seção: Minha Carteira */}
			<section className="mb-10">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold flex items-center gap-2">
						<CreditCard className="w-5 h-5" /> Minha Carteira
					</h2>
					<Button variant="link" asChild>
						<Link href="/wallet">Gerenciar</Link>
					</Button>
				</div>

				<div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
					{mockWallet.map((item) => (
						<Card key={item.id} className="min-w-[240px] flex-shrink-0">
							<CardHeader className="pb-2">
								<CardTitle className="text-lg flex items-center gap-2">
									{item.type === "coupon" ? (
										<Gift className="w-5 h-5" />
									) : (
										<CreditCard className="w-5 h-5" />
									)}
									{item.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-sm mb-2">
									{item.type === "coupon" ? (
										<>
											<div className="font-mono bg-gray-100 p-2 rounded text-center mb-2">
												{item.code}
											</div>
											<p>Válido até: {item.valid}</p>
										</>
									) : (
										<p>Terminado em **** {item.last4}</p>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Seção: Meus Endereços */}
			<section>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold flex items-center gap-2">
						<MapPin className="w-5 h-5" /> Meus Endereços
					</h2>
					<Button variant="link" asChild>
						<Link href="/addresses">Gerenciar</Link>
					</Button>
				</div>

				{addresses.length === 0 ? (
					<div className="text-center py-8">
						<MapPin className="w-12 h-12 mx-auto text-gray-400" />
						<p className="mt-2 text-gray-600">Nenhum endereço cadastrado</p>
						<Button className="mt-4" asChild>
							<Link href="/addresses/new">Adicionar Endereço</Link>
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{addresses.slice(0, 2).map((address) => (
							<Card key={address.id}>
								<CardHeader className="pb-2">
									<CardTitle className="text-lg">{address.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-700">
										{address.street}, {address.number}
										{address.complement && `, ${address.complement}`}
										<br />
										{address.neighborhood} - {address.city}/{address.state}
										<br />
										CEP: {address.zipCode}
									</p>
									<div className="flex gap-2 mt-4">
										<Button variant="outline" size="sm" asChild>
											<Link href={`/addresses/${address.id}/edit`}>Editar</Link>
										</Button>
										<Button variant="outline" size="sm" asChild>
											<Link href={`/addresses/${address.id}/delete`}>
												Remover
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						))}

						{/* Card para adicionar novo endereço */}
						<Card className="border-dashed border-2">
							<CardContent className="flex flex-col items-center justify-center h-full py-8">
								<MapPin className="w-12 h-12 text-gray-400 mb-4" />
								<p className="text-gray-500 mb-4 text-center">
									Adicione um novo endereço de entrega
								</p>
								<Button asChild>
									<Link href="/addresses/new">Adicionar Endereço</Link>
								</Button>
							</CardContent>
						</Card>
					</div>
				)}
			</section>
		</main>
	);
}
