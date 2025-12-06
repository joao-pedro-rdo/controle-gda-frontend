import React from 'react';

const PreviewSection = ({ logo, background }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview das Alterações</h3>
        
        {/* Preview da Tela de Login */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gray-100 px-3 py-2 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500 ml-2">Preview - Tela de Login</span>
            </div>
          </div>
          
          <div 
            className="relative h-64 bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${background})` }}
          >
            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            
            {/* Card de Login */}
            <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
              <div className="text-center mb-4">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-12 w-auto mx-auto mb-2"
                  onError={(e) => {
                    e.target.src = '/img/placeholder.png';
                  }}
                />
                <h2 className="text-lg font-semibold text-gray-900">Sistema de Visitantes</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="h-8 bg-gray-100 rounded"></div>
                </div>
                <div>
                  <div className="h-8 bg-gray-100 rounded"></div>
                </div>
                <div className="h-8 bg-blue-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview do Header */}
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-100 px-3 py-2 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500 ml-2">Preview - Header do Sistema</span>
          </div>
        </div>
        
        <div className="bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-auto"
                onError={(e) => {
                  e.target.src = '/img/placeholder.png';
                }}
              />
              <span className="text-lg font-semibold text-gray-900">
                Controle de Visitantes
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações das Imagens */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Informações</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Logo recomendado: 200x60px (formato PNG com fundo transparente)</li>
          <li>• Imagem de fundo: 1920x1080px ou superior</li>
          <li>• As alterações serão aplicadas após salvar</li>
        </ul>
      </div>
    </div>
  );
};

export default PreviewSection;