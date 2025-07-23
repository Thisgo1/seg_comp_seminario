export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export const mockProducts: Product[] = [
  {
    id: "PROD-001",
    name: "Smartphone X",
    description: "Um smartphone de última geração com câmera de alta resolução e bateria de longa duração.",
    price: 1299.99,
    imageUrl: "https://placehold.co/400x300/E0F2F7/000000?text=Smartphone+X"
  },
  {
    id: "PROD-002",
    name: "Fone de Ouvido Bluetooth",
    description: "Fones sem fio com cancelamento de ruído ativo e som imersivo.",
    price: 249.50,
    imageUrl: "https://placehold.co/400x300/E0F2F7/000000?text=Fone+BT"
  },
  {
    id: "PROD-003",
    name: "Smartwatch Z",
    description: "Relógio inteligente com monitor de saúde, GPS e notificações.",
    price: 499.00,
    imageUrl: "https://placehold.co/400x300/E0F2F7/000000?text=Smartwatch+Z"
  },
  {
    id: "PROD-004",
    name: "Notebook Gamer Pro",
    description: "Potente notebook para jogos e tarefas exigentes, com placa de vídeo dedicada.",
    price: 4500.00,
    imageUrl: "https://placehold.co/400x300/E0F2F7/000000?text=Notebook+Gamer"
  },
  {
    id: "PROD-005",
    name: "Câmera DSLR Profissional",
    description: "Câmera fotográfica com sensor full-frame e lentes intercambiáveis.",
    price: 3100.00,
    imageUrl: "https://placehold.co/400x300/E0F2F7/000000?text=Camera+DSLR"
  }
];
