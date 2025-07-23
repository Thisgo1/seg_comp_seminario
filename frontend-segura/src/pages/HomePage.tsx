import React, { useState } from 'react';
    import { useAuth } from '../context/AuthContext';
    import MessageDisplay from '../components/MessageDisplay';
    import AuthForm from '../components/AuthForm';
    import PurchasePage from './PurchasePage';

    // shadcn/ui imports
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';


    const HomePage: React.FC = () => {
      const { isLoggedIn, logout } = useAuth();
      const [message, setMessage] = useState<string | null>(null);
      const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

      // ADICIONE ESTE CONSOLE.LOG
      console.log('HomePage - isLoggedIn:', isLoggedIn);

      const displayMessage = (msg: string | null, type: 'success' | 'error' | null) => {
        setMessage(msg);
        setMessageType(type);
        if (msg) {
          setTimeout(() => {
            setMessage(null);
            setMessageType(null);
          }, 5000); // Mensagem desaparece após 5 segundos
        }
      };

      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center font-inter p-4">
          <div className="w-full max-w-lg md:max-w-3xl lg:max-w-5xl">
            <MessageDisplay message={message} type={messageType} />
            {isLoggedIn ? (
              <PurchasePage setMessage={displayMessage} />
            ) : (
              <AuthForm onSuccess={() => displayMessage('Login bem-sucedido!', 'success')} setMessage={displayMessage} />
            )}
          </div>
        </div>
      );
    };

    export default HomePage;
