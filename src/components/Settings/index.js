import React from 'react';
import { useNavigate } from 'react-router-dom';
import DestinationManager from './DestinationManager';
import { FaCog, FaInfoCircle, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  // Apenas S2 gerencia as configurações
  const hasPermission = user?.role === 'S2';

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaCog className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span className="font-medium">Voltar</span>
          </button>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow">
            <div className="flex">
              <FaExclamationTriangle className="h-6 w-6 text-yellow-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-yellow-800">Acesso Negado</h3>
                <p className="mt-2 text-sm text-yellow-700">
                  Apenas usuários com perfil <strong>S2</strong> podem alterar as configurações.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar</span>
        </button>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <FaCog className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
              <p className="text-sm text-gray-600 mt-1">Gerencie as seções de destino</p>
            </div>
          </div>
        </div>

        <DestinationManager />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <FaInfoCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Logo, imagem de fundo, título e cores</p>
              <p className="text-blue-700">
                A identidade visual é definida na instalação do sistema (pasta <code>branding</code> e
                arquivo <code>.env</code> do servidor), e não mais por esta tela. Para alterar, peça ao
                responsável pelo servidor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
