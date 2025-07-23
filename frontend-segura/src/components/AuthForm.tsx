import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/api';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface AuthFormProps {
  onSuccess: () => void;
  setMessage: (msg: string | null, type: 'success' | 'error' | null) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, setMessage }) => {
  const [isRegister, setIsRegister] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null, null);

    try {
      if (isRegister) {
        const result = await auth.register(email, password);
        if (result.ok) {
          setMessage(result.message || 'Registro bem-sucedido!', 'success');
          setIsRegister(false); // Mudar para o formulário de login após o registro
        } else {
          setMessage(result.errors?.join(', ') || result.message, 'error');
        }
      } else {
        const result = await auth.login(email, password);
        if (result.ok && result.data) {
          login(result.data.token, result.data.user);
          setMessage(result.message || 'Login bem-sucedido!', 'success');
          onSuccess();
        } else {
          setMessage(result.errors?.join(', ') || result.message, 'error');
        }
      }
    } catch (error: any) {
      console.error('Erro na requisição:', error);
      setMessage(`Erro de conexão: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isRegister ? 'Registrar' : 'Login'}
        </CardTitle>
        <CardDescription className="text-center">
          {isRegister ? 'Crie sua conta para continuar.' : 'Entre na sua conta para acessar os produtos.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Carregando...' : (isRegister ? 'Registrar' : 'Entrar')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}
          <Button variant="link" onClick={() => setIsRegister(!isRegister)} className="p-0 h-auto ml-1">
            {isRegister ? 'Login' : 'Registrar'}
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
