import React from 'react';
import { useAppImages } from '../hooks/useAppImages';

const Header = () => {
  const { logo } = useAppImages();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <img
          src={logo}
          alt="Logo"
          className="h-12 w-auto object-contain"
          onError={(e) => {
            e.target.src = '/img/logo.png'; // Fallback para logo padrão
          }}
        />
        
        {/* Resto do header */}
        <nav>
          {/* ... */}
        </nav>
      </div>
    </header>
  );
};

export default Header;