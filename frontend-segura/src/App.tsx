import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Importa o AuthProvider
import HomePage from './pages/HomePage'; // Importa a HomePage


const App: React.FC = () => {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
};

export default App;
