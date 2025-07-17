"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
	FaBars,
	FaTimes,
	FaSearch,
	FaShoppingCart,
	FaUser,
} from "react-icons/fa";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import useCart from "@/hooks/useCart"; // Importe o hook

export default function Header() {
	const [scrolled, setScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const pathname = usePathname();

	// Usar o hook do carrinho
	const { itemCount } = useCart();

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [pathname]);

	const toggleSearch = () => {
		setIsSearchOpen(!isSearchOpen);
		setIsMobileMenuOpen(false); // Fecha o menu mobile se estiver aberto
	};

	return (
		<header
			className={`fixed top-0 left-0 right-0 bg-[#F1F1F1] shadow-md w-full z-50 ${
				scrolled ? "h-16" : "h-20"
			} transition-all duration-300`}
		>
			<div className="container mx-auto px-4 h-full">
				{/* Barra de pesquisa (ocupa todo o header quando aberta) */}
				{isSearchOpen ? (
					<div className="flex items-center h-full">
						<button onClick={toggleSearch} className="mr-4 text-gray-800">
							<FaTimes className="text-xl" />
						</button>
						<Input
							autoFocus
							placeholder="Pesquise seu item"
							className="flex-1"
						/>
					</div>
				) : (
					<div className="flex justify-between items-center h-full">
						{/* Logo ou conteúdo do lado esquerdo */}
						<div className="flex-1">
							<Link href={"/"}>
								<img
									src="https://in8.com.br/wp-content/themes/bootscore-child-main/img/logo.svg"
									alt="Logo da In8"
								/>
							</Link>
						</div>

						{/* Menu Desktop */}
						<nav className="hidden lg:flex flex-1 justify-center">
							<div className="flex space-x-8 items-center"></div>
						</nav>

						{/* Ícones do lado direito */}
						<div className="flex-1 flex justify-end">
							<div className="flex items-center gap-6">
								<button onClick={toggleSearch} className="text-gray-800">
									<FaSearch className="text-xl" />
								</button>

								{/* Carrinho com badge */}
								<Link href={"/cart"} className="relative">
									<FaShoppingCart className="text-xl" />
									{itemCount > 0 && (
										<span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
											{itemCount}
										</span>
									)}
								</Link>

								<Link href='/user'>
									<FaUser className="text-xl text-gray-800" />
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
