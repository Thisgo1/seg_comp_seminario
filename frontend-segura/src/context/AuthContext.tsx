import React, { useState, useEffect, createContext, useContext } from 'react';

// Interface para o tipo de usuário
interface UserData {
  id: string;
  email: string;
  publicKey: JsonWebKey | null;
}

// Interface para o contexto de autenticação
interface AuthContextType {
  isLoggedIn: boolean;
  user: UserData | null;
  token: string | null;
  login: (token: string, user: UserData) => void;
  logout: () => void;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Componente Provedor de Autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Carregar estado de autenticação do sessionStorage ao iniciar
  useEffect(() => {
    const storedToken = sessionStorage.getItem('authToken'); // Usando sessionStorage
    const storedUser = sessionStorage.getItem('authUser');   // Usando sessionStorage
    if (storedToken && storedUser) {
      try {
        const parsedUser: UserData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        logout(); // Limpa dados inválidos
      }
    }
  }, []);

  const login = (newToken: string, newUser: UserData) => {
    sessionStorage.setItem('authToken', newToken); // Usando sessionStorage
    sessionStorage.setItem('authUser', JSON.stringify(newUser)); // Usando sessionStorage
    setToken(newToken);
    setUser(newUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem('authToken'); // Usando sessionStorage
    sessionStorage.removeItem('authUser');   // Usando sessionStorage
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
