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
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";

const formSchema = z
	.object({
		firstName: z
			.string()
			.min(2, "Nome deve ter pelo menos 2 caracteres")
			.max(50, "Nome não pode ter mais de 50 caracteres"),
		lastName: z
			.string()
			.min(2, "Sobrenome deve ter pelo menos 2 caracteres")
			.max(50, "Sobrenome não pode ter mais de 50 caracteres"),
		email: z.string().email("Por favor, insira um e-mail válido"),
		password: z
			.string()
			.min(8, "A senha deve ter pelo menos 8 caracteres")
			.regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
			.regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
			.regex(/[0-9]/, "Deve conter pelo menos um número"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export default function Register() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const router = useRouter();
	const { signup, error, isLoading } = useAuth();
	const [isRedirecting, setIsRedirecting] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const success = await signup({
			firstName: values.firstName,
			lastName: values.lastName,
			email: values.email,
			password: values.password,
		});

		if (success) {
			setIsRedirecting(true);
			router.push("/");
		}
	};

	return (
		<main className="min-h-screen flex flex-col bg-gray-50">
			<Header />

			<div className="flex-1 flex items-center justify-center py-12 px-4">
				<div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900">Crie sua conta</h1>
						<p className="mt-2 text-gray-600">
							Junte-se a nós e comece sua jornada
						</p>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
							{error}
						</div>
					)}

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-5"
						>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Primeiro nome</FormLabel>
											<FormControl>
												<div className="relative">
													<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
														<FaUser className="text-gray-400" size={16} />
													</div>
													<Input
														placeholder="Ex: João"
														{...field}
														className="pl-10"
														disabled={isLoading || isRedirecting}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Sobrenome</FormLabel>
											<FormControl>
												<div className="relative">
													<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
														<FaUser className="text-gray-400" size={16} />
													</div>
													<Input
														placeholder="Ex: Silva"
														{...field}
														className="pl-10"
														disabled={isLoading || isRedirecting}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail</FormLabel>
										<FormControl>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
													<FaEnvelope className="text-gray-400" size={16} />
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
										<FormLabel>Senha</FormLabel>
										<FormControl>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
													<FaLock className="text-gray-400" size={16} />
												</div>
												<Input
													placeholder="Crie uma senha segura"
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
														<FaEyeSlash className="text-gray-400" size={16} />
													) : (
														<FaEye className="text-gray-400" size={16} />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
										<div className="text-xs text-gray-500 mt-1">
											Use pelo menos 8 caracteres, uma letra maiúscula, uma
											minúscula e um número
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirmar senha</FormLabel>
										<FormControl>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
													<FaLock className="text-gray-400" size={16} />
												</div>
												<Input
													placeholder="Confirme sua senha"
													{...field}
													className="pl-10 pr-10"
													disabled={isLoading || isRedirecting}
													type={showConfirmPassword ? "text" : "password"}
												/>
												<button
													type="button"
													className="absolute inset-y-0 right-0 flex items-center pr-3"
													onClick={() =>
														setShowConfirmPassword(!showConfirmPassword)
													}
													disabled={isLoading || isRedirecting}
												>
													{showConfirmPassword ? (
														<FaEyeSlash className="text-gray-400" size={16} />
													) : (
														<FaEye className="text-gray-400" size={16} />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex items-center">
								<input
									id="terms"
									name="terms"
									type="checkbox"
									className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
									required
									disabled={isLoading || isRedirecting}
								/>
								<label
									htmlFor="terms"
									className="ml-2 block text-sm text-gray-600"
								>
									Concordo com os{" "}
									<a href="#" className="text-primary hover:underline">
										Termos de Serviço
									</a>{" "}
									e{" "}
									<a href="#" className="text-primary hover:underline">
										Política de Privacidade
									</a>
								</label>
							</div>

							<Button
								type="submit"
								className="w-full h-12 text-base"
								disabled={isLoading || isRedirecting}
							>
								{isRedirecting
									? "Redirecionando..."
									: isLoading
									? "Criando conta..."
									: "Criar conta"}
							</Button>

							<div className="text-center text-sm mt-4">
								<p className="text-gray-600">
									Já tem uma conta?{" "}
									<Link
										href="/auth/login"
										className="font-medium text-primary hover:underline"
									>
										Faça login
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
