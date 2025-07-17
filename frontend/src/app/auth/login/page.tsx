"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";

const formSchema = z.object({
	email: z.string().email("Por favor, insira um e-mail válido"),
	password: z.string().min(1, "A senha é obrigatória"),
});

export default function Login() {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const { login, error, isLoading } = useAuth();
	const [isRedirecting, setIsRedirecting] = useState(false);

	// Redirecionar se já estiver logado
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsRedirecting(true);
			router.push("/");
		}
	}, [router]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { email: "", password: "" },
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const success = await login(values.email, values.password);

		if (success) {
			setIsRedirecting(true);
			router.push("/");
		}
	};

	return (
		<main className="min-h-screen flex flex-col">
			<Header />

			<div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
					<div className="text-center">
						<h2 className="mt-6 text-3xl font-bold text-gray-900">
							Entrar na sua conta
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							Acesse sua conta para continuar
						</p>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
							{error}
						</div>
					)}

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="mt-8 space-y-6"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail</FormLabel>
										<FormControl>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
													<FaEnvelope className="text-gray-400" />
												</div>
												<Input
													placeholder="seuemail@exemplo.com"
													{...field}
													className="pl-10"
													disabled={isLoading || isRedirecting}
													type="email"
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<div className="flex justify-between items-center">
											<FormLabel>Senha</FormLabel>
											<Link
												href="/forgot-password"
												className="text-sm text-primary hover:underline"
											>
												Esqueceu a senha?
											</Link>
										</div>
										<FormControl>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
													<FaLock className="text-gray-400" />
												</div>
												<Input
													placeholder="Digite sua senha"
													{...field}
													className="pl-10 pr-10"
													disabled={isLoading || isRedirecting}
													type={showPassword ? "text" : "password"}
												/>
												<button
													type="button"
													className="absolute inset-y-0 right-0 flex items-center pr-3"
													onClick={() => setShowPassword(!showPassword)}
													disabled={isLoading || isRedirecting}
												>
													{showPassword ? (
														<FaEyeSlash className="text-gray-400" />
													) : (
														<FaEye className="text-gray-400" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								className="w-full"
								disabled={isLoading || isRedirecting}
							>
								{isRedirecting
									? "Redirecionando..."
									: isLoading
									? "Entrando..."
									: "Entrar"}
							</Button>

							<div className="text-center text-sm mt-4">
								<p className="text-gray-600">
									Não tem uma conta?{" "}
									<Link
										href="/auth/register"
										className="font-medium text-primary hover:underline"
									>
										Cadastre-se
									</Link>
								</p>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</main>
	);
}
