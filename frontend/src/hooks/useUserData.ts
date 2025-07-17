import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { getToken } from "@/lib/auth";

export const useUserData = () => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const token = getToken();
				if (!token) {
					setLoading(false);
					setError("Usuário não autenticado");
					return;
				}

				const userData = await api.user.getMe(token);
				setUser(userData);
			} catch (err) {
				setError("Erro ao carregar dados do usuário");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	return { user, loading, error };
};
