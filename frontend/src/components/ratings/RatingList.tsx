import { StarRating } from "./StarRating";

export const RatingList = ({
	ratings,
}: {
	ratings: Array<{
		id: number;
		rating: number;
		comment?: string;
		user: { firstName: string };
		createdAt: string;
	}>;
}) => {
	if (ratings.length === 0) {
		return <p className="text-gray-500">Nenhuma avaliação ainda</p>;
	}

	return (
		<div className="mt-4 space-y-4">
			{ratings.map((rating) => (
				<div key={rating.id} className="border-b pb-4">
					<div className="flex items-center mb-1">
						<StarRating rating={rating.rating} size="xs" />
						<span className="ml-2 text-sm text-gray-600">
							{rating.user.firstName}
						</span>
					</div>
					{rating.comment && (
						<p className="text-gray-700 mt-1">{rating.comment}</p>
					)}
					<p className="text-xs text-gray-400 mt-1">
						{new Date(rating.createdAt).toLocaleDateString()}
					</p>
				</div>
			))}
		</div>
	);
};
