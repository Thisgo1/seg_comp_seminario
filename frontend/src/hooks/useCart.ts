'use client'
import { useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  imageUrl?: string;
}

export default function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Recuperar do localStorage na inicialização
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Salvar no localStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Adicionar item ao carrinho
  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      // Verificar se o item já está no carrinho
      const existingItem = prevCart.find(i => 
        i.id === item.id && 
        i.size === item.size && 
        i.color === item.color
      );
      
      if (existingItem) {
        // Atualizar quantidade se já existir
        return prevCart.map(i => 
          i.id === item.id && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // Adicionar novo item
        return [...prevCart, item];
      }
    });
  };

  // Remover item do carrinho
  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Atualizar quantidade de um item
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Limpar o carrinho
  const clearCart = () => {
    setCart([]);
  };

  // Calcular total de itens
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calcular total do carrinho
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    cart,
    itemCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}
