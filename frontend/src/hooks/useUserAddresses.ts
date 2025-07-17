import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { getToken } from "@/lib/auth";

export const useUserAddresses = () => {
	const [addresses, setAddresses] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAddresses = async () => {
			try {
				const token = getToken();
				if (!token) return;

				const addressesData = await api.addresses.getAll(token);
				setAddresses(addressesData);
			} catch (err) {
				setError("Erro ao carregar endereços");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchAddresses();
	}, []);

	return { addresses, loading, error };
};
