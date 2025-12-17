import React from 'react';
import { useAppImages } from '../hooks/useAppImages';

const Login = () => {
  const { logo, background, loading } = useAppImages();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Logo"
            className="h-20 w-auto object-contain"
            onError={(e) => {
              e.target.src = '/img/logo.png'; // Fallback
            }}
          />
        </div>
        
        {/* Resto do formulário de login */}
        <form>
          {/* ... */}
        </form>
      </div>
    </div>
  );
};

export default Login;