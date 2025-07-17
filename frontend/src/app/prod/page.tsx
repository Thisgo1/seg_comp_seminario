// src/app/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/types";
import Header from "@/components/Header";
import { ProductListItem } from "@/components/products/ProductListItem"; // Importe o novo componente

// Mock data para quando não houver produtos
const MOCK_PRODUCTS: Product[] = [
  {
    id: "mock-1",
    name: "Produto Exemplo 1",
    price: 89.9,
    description: "Descrição do produto exemplo 1",
    provider: "BRASILIAN",
    averageRating: 4.5,
    ratingCount: 10,
    imageUrl: "/placeholder-product.jpg",
    category: "eletronicos",
  },
  {
    id: "mock-2",
    name: "Produto Exemplo 2",
    price: 120.0,
    description: "Descrição do produto exemplo 2",
    provider: "EUROPEAN",
    averageRating: 4.2,
    ratingCount: 8,
    imageUrl: "/placeholder-product.jpg",
    category: "moda",
  },
  {
    id: "mock-3",
    name: "Produto Exemplo 3",
    price: 75.5,
    description: "Descrição do produto exemplo 3",
    provider: "BRASILIAN",
    averageRating: 4.0,
    ratingCount: 15,
    imageUrl: "/placeholder-product.jpg",
    category: "casa",
  },
  {
    id: "mock-4",
    name: "Produto Exemplo 4",
    price: 199.9,
    description: "Descrição do produto exemplo 4",
    provider: "EUROPEAN",
    averageRating: 4.7,
    ratingCount: 20,
    imageUrl: "/placeholder-product.jpg",
    category: "eletronicos",
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMock, setShowMock] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.products.getAll(1, 20, "user-token");

        // Se houver produtos, usa os dados da API
        if (data.items && data.items.length > 0) {
          setProducts(data.items);
          setShowMock(false);
        } else {
          // Se não houver produtos, usa o mock
          setProducts(MOCK_PRODUCTS);
          setShowMock(true);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        // Em caso de erro, usa os produtos mockados
        setProducts(MOCK_PRODUCTS);
        setShowMock(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      return;
    }

    try {
      setLoading(true);
      const data = await api.products.search(searchQuery, "user-token");
      setProducts(data);
      setShowMock(data.length === 0);
    } catch (error) {
      console.error("Erro na busca:", error);
      setProducts(MOCK_PRODUCTS);
      setShowMock(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-24">
        <Header />
      </div>

      <h1 className="text-3xl font-bold mb-6 mt-24">Produtos</h1>

      {/* Barra de busca
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </div> */}

      {/* Lista de produtos */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <Skeleton className="w-full h-[174px]" />
              <div className="p-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {showMock && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Estamos exibindo produtos de exemplo. Nenhum produto real
                    foi encontrado.
                  </p>
                </div>
              </div>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                Nenhum produto encontrado.
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setProducts(MOCK_PRODUCTS);
                  setShowMock(true);
                }}
              >
                Ver produtos de exemplo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductListItem 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    averageRating: product.averageRating,
                    ratingCount: product.ratingCount,
                    imageUrl: product.imageUrl
                  }} 
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
