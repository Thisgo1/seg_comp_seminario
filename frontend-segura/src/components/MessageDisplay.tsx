import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Importa Alert do shadcn/ui
import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons'; // Ícones para o Alert

interface MessageDisplayProps {
  message: string | null;
  type: 'success' | 'error' | null;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, type }) => {
  if (!message) return null;

  const alertVariant = type === 'success' ? 'default' : 'destructive'; // shadcn/ui Alert variants
  const Icon = type === 'success' ? CheckCircledIcon : ExclamationTriangleIcon;

  return (
    <Alert variant={alertVariant} className="mb-4">
      <Icon className="h-4 w-4" />
      <AlertTitle>{type === 'success' ? 'Sucesso!' : 'Erro!'}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default MessageDisplay;
