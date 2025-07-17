'use client'
import Header from "@/components/Header";
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
import { FaLock, FaArrowLeft } from "react-icons/fa";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

// Dados mockados
const mockCartItems = [
	{
		id: "prod-1",
		name: "Camiseta Básica Branca",
		price: 49.9,
		quantity: 2,
		imageUrl: "/camiseta-branca.jpg",
	},
	{
		id: "prod-2",
		name: "Calça Jeans Slim",
		price: 129.9,
		quantity: 1,
		imageUrl: "/calca-jeans.jpg",
	},
];

const mockAddresses = [
	{
		id: "addr-1",
		name: "Casa",
		address: "Rua das Flores, 123 - Centro, São Paulo/SP, 01001-000",
	},
	{
		id: "addr-2",
		name: "Trabalho",
		address: "Av. Paulista, 1000 - Bela Vista, São Paulo/SP, 01310-100",
	},
];

const mockShippingOptions = [
	{
		id: "shipping-1",
		name: "Entrega Padrão",
		description: "Entrega em 5-7 dias úteis",
		price: 15.9,
	},
	{
		id: "shipping-2",
		name: "Entrega Expressa",
		description: "Entrega em 2-3 dias úteis",
		price: 29.9,
	},
	{
		id: "shipping-3",
		name: "Entrega no Dia Seguinte",
		description: "Entrega no próximo dia útil",
		price: 49.9,
	},
];

const mockPaymentMethods = [
	{
		id: "credit",
		name: "Cartão de Crédito",
		icon: "credit-card",
	},
	{
		id: "pix",
		name: "PIX",
		icon: "pix",
		description: "Desconto de 5%",
	},
	{
		id: "boleto",
		name: "Boleto Bancário",
		icon: "barcode",
		description: "Desconto de 3%",
	},
];

export default function CheckoutPage() {
	const [step, setStep] = useState(1); // 1: Endereço, 2: Entrega, 3: Pagamento
	const [selectedAddress, setSelectedAddress] = useState("addr-1");
	const [shippingMethod, setShippingMethod] = useState("shipping-1");
	const [paymentMethod, setPaymentMethod] = useState("credit");
	const [saveInfo, setSaveInfo] = useState(true);

	// Cálculos
	const subtotal = mockCartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const shippingPrice =
		mockShippingOptions.find((s) => s.id === shippingMethod)?.price || 0;
	const discount =
		paymentMethod === "pix"
			? subtotal * 0.05
			: paymentMethod === "boleto"
			? subtotal * 0.03
			: 0;
	const total = subtotal + shippingPrice - discount;

	// Renderização condicional por etapa
	const renderStepContent = () => {
		switch (step) {
			case 1:
				return (
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<h3 className="text-lg font-semibold mb-4">
							Selecione o endereço de entrega
						</h3>

						<div className="space-y-4 mb-6">
							<RadioGroup
								value={selectedAddress}
								onValueChange={setSelectedAddress}
							>
								{mockAddresses.map((address) => (
									<div key={address.id} className="flex items-start space-x-3">
										<RadioGroupItem value={address.id} id={address.id} />
										<Label htmlFor={address.id} className="flex flex-col">
											<span className="font-medium">{address.name}</span>
											<span className="text-sm text-gray-600">
												{address.address}
											</span>
										</Label>
									</div>
								))}
							</RadioGroup>
						</div>

						<Button variant="outline" className="w-full mb-4">
							Adicionar novo endereço
						</Button>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="save-address"
								checked={saveInfo}
								onCheckedChange={(checked) => setSaveInfo(Boolean(checked))}
							/>
							<Label htmlFor="save-address">
								Salvar este endereço para futuras compras
							</Label>
						</div>
					</div>
				);

			case 2:
				return (
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<h3 className="text-lg font-semibold mb-4">Método de Entrega</h3>

						<div className="space-y-4">
							<RadioGroup
								value={shippingMethod}
								onValueChange={setShippingMethod}
							>
								{mockShippingOptions.map((option) => (
									<div
										key={option.id}
										className="flex items-start space-x-3 border rounded-md p-4"
									>
										<RadioGroupItem value={option.id} id={option.id} />
										<Label htmlFor={option.id} className="flex flex-col w-full">
											<div className="flex justify-between w-full">
												<span className="font-medium">{option.name}</span>
												<span className="font-semibold">
													R$ {option.price.toFixed(2).replace(".", ",")}
												</span>
											</div>
											<span className="text-sm text-gray-600">
												{option.description}
											</span>
										</Label>
									</div>
								))}
							</RadioGroup>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<h3 className="text-lg font-semibold mb-4">Método de Pagamento</h3>

						<div className="space-y-4 mb-6">
							<RadioGroup
								value={paymentMethod}
								onValueChange={setPaymentMethod}
							>
								{mockPaymentMethods.map((method) => (
									<div
										key={method.id}
										className="flex items-start space-x-3 border rounded-md p-4"
									>
										<RadioGroupItem value={method.id} id={method.id} />
										<Label htmlFor={method.id} className="flex flex-col w-full">
											<div className="flex justify-between w-full">
												<span className="font-medium">{method.name}</span>
												{method.description && (
													<span className="text-green-600 font-medium">
														{method.description}
													</span>
												)}
											</div>
											{method.id === "credit" && (
												<div className="mt-4">
													<div className="grid grid-cols-2 gap-4">
														<div>
															<Label htmlFor="card-number">
																Número do Cartão
															</Label>
															<Input
																id="card-number"
																placeholder="**** **** **** ****"
															/>
														</div>
														<div>
															<Label htmlFor="card-name">Nome no Cartão</Label>
															<Input
																id="card-name"
																placeholder="Nome completo"
															/>
														</div>
														<div>
															<Label htmlFor="card-expiry">Validade</Label>
															<Input id="card-expiry" placeholder="MM/AA" />
														</div>
														<div>
															<Label htmlFor="card-cvv">CVV</Label>
															<Input id="card-cvv" placeholder="***" />
														</div>
													</div>
												</div>
											)}
										</Label>
									</div>
								))}
							</RadioGroup>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="save-payment"
								checked={saveInfo}
								onCheckedChange={setSaveInfo}
							/>
							<Label htmlFor="save-payment">
								Salvar informações de pagamento para futuras compras
							</Label>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	const renderOrderSummary = () => (
		<div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
			<h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>

			<div className="space-y-3 mb-4">
				{mockCartItems.map((item) => (
					<div key={item.id} className="flex justify-between text-sm">
						<div>
							<span className="font-medium">{item.name}</span>
							<span className="text-gray-600"> × {item.quantity}</span>
						</div>
						<span>
							R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
						</span>
					</div>
				))}
			</div>

			<div className="space-y-2 border-t pt-4">
				<div className="flex justify-between">
					<span>Subtotal</span>
					<span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
				</div>

				<div className="flex justify-between">
					<span>Frete</span>
					<span>
						{shippingPrice > 0
							? `R$ ${shippingPrice.toFixed(2).replace(".", ",")}`
							: "Grátis"}
					</span>
				</div>

				{discount > 0 && (
					<div className="flex justify-between text-green-600">
						<span>Desconto</span>
						<span>- R$ {discount.toFixed(2).replace(".", ",")}</span>
					</div>
				)}

				<div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
					<span>Total</span>
					<span>R$ {total.toFixed(2).replace(".", ",")}</span>
				</div>
			</div>

			<div className="mt-6 flex items-center text-sm text-gray-600">
				<FaLock className="mr-2" />
				<span>Pagamento seguro • Seus dados estão protegidos</span>
			</div>
		</div>
	);

	const renderStepNavigation = () => (
		<div className="flex justify-between mt-6">
			{step > 1 ? (
				<Button variant="outline" onClick={() => setStep(step - 1)}>
					<FaArrowLeft className="mr-2" /> Voltar
				</Button>
			) : (
				<Button variant="outline" asChild>
					<a href="/cart">Voltar para o carrinho</a>
				</Button>
			)}

			{step < 3 ? (
				<Button onClick={() => setStep(step + 1)}>
					Continuar para {step === 1 ? "Entrega" : "Pagamento"}
				</Button>
			) : (
				<Button className="bg-green-600 hover:bg-green-700">
					Finalizar Compra
				</Button>
			)}
		</div>
	);

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
							<BreadcrumbLink href="/cart">Carrinho</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Checkout</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{/* Conteúdo principal */}
			<div className="container mx-auto px-4 py-6 flex-1">
				<div className="max-w-4xl mx-auto text-center mb-8">
					<h1 className="text-2xl md:text-3xl font-bold mb-2">
						Finalize sua compra
					</h1>
					<div className="flex justify-center">
						<div className="flex items-center">
							<div
								className={`rounded-full h-8 w-8 flex items-center justify-center ${
									step >= 1
										? "bg-primary text-white"
										: "bg-gray-200 text-gray-700"
								}`}
							>
								1
							</div>
							<div
								className={`h-1 w-16 ${
									step >= 2 ? "bg-primary" : "bg-gray-200"
								}`}
							></div>
							<div
								className={`rounded-full h-8 w-8 flex items-center justify-center ${
									step >= 2
										? "bg-primary text-white"
										: "bg-gray-200 text-gray-700"
								}`}
							>
								2
							</div>
							<div
								className={`h-1 w-16 ${
									step >= 3 ? "bg-primary" : "bg-gray-200"
								}`}
							></div>
							<div
								className={`rounded-full h-8 w-8 flex items-center justify-center ${
									step >= 3
										? "bg-primary text-white"
										: "bg-gray-200 text-gray-700"
								}`}
							>
								3
							</div>
						</div>
					</div>
					<div className="flex justify-between text-sm mt-2 px-6 max-w-xs mx-auto">
						<span className={step >= 1 ? "font-medium" : "text-gray-500"}>
							Endereço
						</span>
						<span className={step >= 2 ? "font-medium" : "text-gray-500"}>
							Entrega
						</span>
						<span className={step >= 3 ? "font-medium" : "text-gray-500"}>
							Pagamento
						</span>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						{renderStepContent()}
						{renderStepNavigation()}
					</div>

					<div className="lg:col-span-1">{renderOrderSummary()}</div>
				</div>
			</div>

			{/* Rodapé */}
			<footer className="bg-gray-100 py-6 mt-12">
				<div className="container mx-auto px-4 text-center text-gray-600 text-sm">
					<p>© 2023 Minha Loja. Todos os direitos reservados.</p>
					<div className="mt-2 flex justify-center space-x-4">
						<a href="#" className="hover:text-primary">
							Termos de Uso
						</a>
						<a href="#" className="hover:text-primary">
							Política de Privacidade
						</a>
						<a href="#" className="hover:text-primary">
							Contato
						</a>
					</div>
				</div>
			</footer>
		</main>
	);
}
