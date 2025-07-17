'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export default function AuthRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/auth/me');
      } catch (error) {
        toast({
          title: 'Acesso não autorizado',
          description: 'Você precisa fazer login para acessar esta página.',
          variant: 'destructive',
        });
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
}
