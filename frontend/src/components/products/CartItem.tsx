
import { FaTrashAlt } from "react-icons/fa";
import Counter from "../Counter";
import useCart from "@/hooks/useCart"; // Importe o hook

interface CartItemProps {
	item: CartItem; // Usando a interface do hook
}

export default function CartItem({ item }: CartItemProps) {
	const { updateQuantity, removeFromCart } = useCart();

	const handleQuantityChange = (newQuantity: number) => {
		updateQuantity(item.id, newQuantity);
	};

	return (
		<div className="flex items-start gap-4 py-4 border-b border-gray-200">
			{/* Imagem do produto */}
			<div className="relative w-[99px] h-[99px] flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
				<img
					src={item.imageUrl || "/placeholder-product.jpg"}
					alt={item.name}
					className="object-contain"
				/>
			</div>

			{/* Informações do produto */}
			<div className="flex-1 min-w-0">
				{/* Nome e botão de remover */}
				<div className="flex justify-between items-start mb-1">
					<h3 className="font-medium text-base line-clamp-2 pr-2">
						{item.name}
					</h3>
					<button
						onClick={() => removeFromCart(item.id)}
						className="text-gray-400 hover:text-red-500 transition-colors p-1"
						aria-label="Remover item"
					>
						<FaTrashAlt className="text-red-600" size={16} />
					</button>
				</div>

				{/* Tamanho e cor */}
				<div className="text-sm text-gray-600 space-y-1 mb-3">
					{item.size && <p>Tamanho: {item.size}</p>}
					{item.color && <p>Cor: {item.color}</p>}
				</div>

				{/* Preço e contador */}
				<div className="flex justify-between items-center">
					<span className="font-semibold text-base">
						R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
					</span>
					<Counter
						value={item.quantity}
						onChange={handleQuantityChange}
						min={1}
						max={99}
					/>
				</div>
			</div>
		</div>
	);
}
