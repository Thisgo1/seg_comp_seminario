import { useState } from "react";
import { StarRating } from "./StarRating";
import { api } from "../services/api";

export const ProductRating = ({
	productId,
	provider,
	userRating,
}: {
	productId: string;
	provider: "BRASILIAN" | "EUROPEAN";
	userRating?: number | null;
}) => {
	const [rating, setRating] = useState(userRating || 0);
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		try {
			setIsSubmitting(true);
			await api.products.rateProduct(productId, provider, {
				rating,
				comment,
			});
			// Atualizar estado global ou refetch
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">Avalie este produto</h3>
			<StarRating rating={rating} onRate={setRating} size="lg" />
			<textarea
				value={comment}
				onChange={(e) => setComment(e.target)}
				placeholder="Deixe um comentário (opcional)"
				className="w-full p-2 border rounded"
				rows={3}
			/>
			<button
				onClick={handleSubmit}
				disabled={isSubmitting || rating === 0}
				className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
			>
				{isSubmitting ? "Enviando..." : "Enviar Avaliação"}
			</button>
		</div>
	);
};
