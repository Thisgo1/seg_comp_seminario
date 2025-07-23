import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { purchase } from '../services/api';
import { Product } from '../data/products'; // Importa a interface Product

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PurchaseFormProps {
  selectedProduct: Product; // Recebe o produto selecionado
  setMessage: (msg: string | null, type: 'success' | 'error' | null) => void;
  onPurchaseSuccess: () => void; // Callback para quando a compra for um sucesso
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ selectedProduct, setMessage, onPurchaseSuccess }) => {
  const { user, token, logout } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>(''); // Campo de confirmação de senha
  const [quantity, setQuantity] = useState<number>(1); // NOVO: Estado para a quantidade
  const [orderId, setOrderId] = useState<string>('ORD-' + Math.floor(Math.random() * 100000)); // Gerar ID único

  // Calcula o valor total com base na quantidade e preço do produto
  // ADIÇÃO: Verifica se selectedProduct existe antes de acessar .price
  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;

  // Reseta o orderId e a quantidade quando um novo produto é selecionado
  useEffect(() => {
    setOrderId('ORD-' + Math.floor(Math.random() * 100000));
    setQuantity(1);
    setPasswordConfirmation('');
  }, [selectedProduct]);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null, null);

    if (!user || !token) {
      setMessage('Usuário não autenticado.', 'error');
      setLoading(false);
      return;
    }

    // ADIÇÃO: Verificação adicional para selectedProduct dentro de handlePurchase
    if (!selectedProduct) {
      setMessage('Nenhum produto selecionado para compra.', 'error');
      setLoading(false);
      return;
    }

    if (!passwordConfirmation) {
      setMessage('Por favor, confirme sua senha para finalizar a compra.', 'error');
      setLoading(false);
      return;
    }

    if (quantity <= 0) {
      setMessage('A quantidade deve ser pelo menos 1.', 'error');
      setLoading(false);
      return;
    }

    const payloadToSign = {
      orderId: orderId,
      item: selectedProduct.name,
      quantity: quantity, // Usando a quantidade do estado
      price: selectedProduct.price, // Preço unitário do produto
      currency: "BRL",
      timestamp: new Date().toISOString(),
      productId: selectedProduct.id,
      amount: totalPrice, // Valor total da compra (preço * quantidade)
    };

    try {
      // 1. Solicitar assinatura do payload ao backend
      // A senha de confirmação é enviada para o backend para descriptografar a chave privada
      const signResult = await purchase.signPayload(payloadToSign, passwordConfirmation, token);

      if (!signResult.ok || !signResult.data) {
        setMessage(signResult.errors?.join(', ') || signResult.message || 'Falha ao obter assinatura.', 'error');
        setLoading(false);
        return;
      }

      const signature = signResult.data.signature;

      // 2. Enviar payload e assinatura para finalizar a compra
      const purchaseResult = await purchase.createPurchase(payloadToSign, signature, token);

      if (purchaseResult.ok) {
        setMessage(purchaseResult.message || 'Compra realizada com sucesso!', 'success');
        onPurchaseSuccess(); // Chamar callback de sucesso para limpar o produto selecionado
        setOrderId('ORD-' + Math.floor(Math.random() * 100000)); // Gerar novo ID para próxima compra
        setQuantity(1); // Resetar quantidade
        setPasswordConfirmation(''); // Limpar campo de senha
      } else {
        setMessage(purchaseResult.errors?.join(', ') || purchaseResult.message || 'Falha ao finalizar compra.', 'error');
      }
    } catch (error: any) {
      console.error('Erro na requisição de compra:', error);
      setMessage(`Erro de conexão: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ADIÇÃO: Renderiza um fallback ou retorna null se selectedProduct não estiver disponível
  if (!selectedProduct) {
    // Isso não deveria acontecer se PurchasePage estiver fazendo a renderização condicional corretamente,
    // mas é uma salvaguarda.
    console.warn('PurchaseForm renderizado sem selectedProduct. Retornando para a lista de produtos.');
    // Chame onPurchaseSuccess para forçar o retorno à lista de produtos
    onPurchaseSuccess();
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Confirmar Compra</CardTitle>
        <CardDescription className="text-center">
          Você está comprando: <span className="font-semibold">{selectedProduct.name}</span>
        </CardDescription>
        <p className="text-blue-600 font-bold text-xl text-center mt-2">Valor Unitário: R$ {selectedProduct.price.toFixed(2)}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePurchase} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="orderId">ID do Pedido</Label>
            <Input
              type="text"
              id="orderId"
              value={orderId}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="productId">ID do Produto</Label>
            <Input
              type="text"
              id="productId"
              value={selectedProduct.id}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="productName">Nome do Produto</Label>
            <Input
              type="text"
              id="productName"
              value={selectedProduct.name}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} // Garante mínimo de 1
              min="1"
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="totalAmount">Valor Total</Label>
            <Input
              type="text"
              id="totalAmount"
              value={`R$ ${totalPrice.toFixed(2)}`}
              readOnly
              className="bg-gray-100 cursor-not-allowed font-bold text-lg"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="passwordConfirmation">Confirme sua Senha</Label>
            <Input
              type="password"
              id="passwordConfirmation"
              placeholder="Digite sua senha novamente"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processando...' : 'Finalizar Compra'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button variant="outline" onClick={onPurchaseSuccess} className="w-full">
          Voltar aos Produtos
        </Button>
        <Button variant="destructive" onClick={logout} className="w-full">
          Sair
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PurchaseForm;
