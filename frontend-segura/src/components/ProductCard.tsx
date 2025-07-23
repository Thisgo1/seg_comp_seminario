import React from 'react';
import { Product } from '../data/products';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  return (
    <Card className="flex flex-col justify-between transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
      <CardHeader className="p-0">
        <img
          className="w-full h-48 object-cover rounded-t-xl"
          src={product.imageUrl}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/400x300/E0F2F7/000000?text=Imagem+Nao+Disponivel";
          }}
        />
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{product.name}</CardTitle>
        <CardDescription className="text-gray-600 text-sm mb-3">{product.description}</CardDescription>
        <p className="text-blue-600 font-bold text-lg">R$ {product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onSelectProduct(product)} className="w-full">
          Comprar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
