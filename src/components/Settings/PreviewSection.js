import React from 'react';
import { FaEye } from 'react-icons/fa';

const PreviewSection = ({ logo, background }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      <div className="flex items-center mb-4">
        <FaEye className="h-6 w-6 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Pré-visualização</h3>
      </div>

      {/* Preview da Tela de Login */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
          <p className="text-xs font-medium text-gray-600">Tela de Login</p>
        </div>
        
        <div 
          className="relative h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${background})` }}
        >
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          {/* Conteúdo */}
          <div className="relative h-full flex flex-col items-center justify-center p-8">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xs">
              <div className="flex justify-center mb-4">
                <img
                  src={logo}
                  alt="Logo Preview"
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="50"%3E%3Crect fill="%23ddd" width="100" height="50"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ELogo%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-9 bg-blue-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview do Header */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
          <p className="text-xs font-medium text-gray-600">Cabeçalho do Sistema</p>
        </div>
        
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <img
            src={logo}
            alt="Logo Preview"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="40"%3E%3Crect fill="%23ddd" width="100" height="40"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ELogo%3C/text%3E%3C/svg%3E';
            }}
          />
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50">
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Informações */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          <strong>Nota:</strong> As alterações serão refletidas em todo o sistema após salvar.
        </p>
      </div>
    </div>
  );
};

export default PreviewSection;