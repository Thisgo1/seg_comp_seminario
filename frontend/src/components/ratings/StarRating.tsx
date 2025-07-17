import { FaRegStar, FaRegStarHalf, FaStar } from "react-icons/fa";

interface StarRatingProps {
	rating: number;
	size?: "xs" | "sm" | "md";
	className?: string;
}

export const StarRating = ({
	rating,
	size = "sm",
	className,
}: StarRatingProps) => {
	const sizes = {
		xs: "text-base",
		sm: "text-xl",
		md: "text-2xl",
	};

	return (
		<div className={`flex items-center ${className}`}>
			{[1, 2, 3, 4, 5].map((star) => {
				const isFilled = rating >= star;
				const isHalf = rating >= star - 0.5 && rating < star;

				return (
					<span key={star} className={`${sizes[size]} mx-0.5`}>
						{isFilled ? (
							<FaStar className="text-yellow-400" />
						) : isHalf ? (
							<span className="relative">
								<FaRegStarHalf className="absolute left-0 top-0 w-1/2 overflow-hidden text-yellow-400" />
							</span>
						) : (
							<span className="text-gray-300">
								<FaRegStar />
							</span>
						)}
					</span>
				);
			})}
		</div>
	);
};
