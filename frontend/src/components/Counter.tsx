"use client";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

export default function Counter() {
	const [count, setCount] = useState(0);

	const handleDecrement = () => {
		if (count > 0) {
			setCount((prevCount) => prevCount - 1);
		}
	};

	const handleIncrement = () => {
		setCount((prevCount) => prevCount + 1);
	};

	return (
		<main className="flex items-center justify-center ">
			<button
				className="text-2xl font-bold w-8 h-8 flex items-center justify-center"
				onClick={handleDecrement}
			>
				<FaMinus />
			</button>
			<div className="text-2xl font-bold min-w-[2rem] text-center">{count}</div>
			<button
				className="text-2xl font-bold w-8 h-8 flex items-center justify-center"
				onClick={handleIncrement}
			>
				<FaPlus />
			</button>
		</main>
	);
}
