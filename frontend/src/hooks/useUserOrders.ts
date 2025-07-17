import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { getToken } from "@/lib/auth";

export const useUserOrders = () => {
	const [orders, setOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const token = getToken();
				if (!token) {
					setLoading(false);
					return;
				}

				const ordersData = await api.orders.getAll(token);
				const formattedOrders = ordersData.map((order) => ({
					...order,
					total:
						order.total ||
						order.items.reduce(
							(sum, item) => sum + item.price * item.quantity,
							0
						),
				}));

				setOrders(formattedOrders);
			} catch (err) {
				setError("Erro ao carregar pedidos");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	return { orders, loading, error };
};
