import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from './ImageUploader';
import PreviewSection from './PreviewSection';
import DestinationManager from './DestinationManager';
import ColorSchemeManager from './ColorSchemeManager';
import { FaCog, FaInfoCircle, FaExclamationTriangle, FaArrowLeft, FaSave } from 'react-icons/fa';
import { useAppImages } from '../../hooks/useAppImages';
import { useAuth } from '../../context/AuthContext';
import { useSystemSettings } from '../../hooks/useSystemSettings';

const Settings = () => {
  const navigate = useNavigate();
  const { logo, background, loading, refreshImages } = useAppImages();
  const { user, isLoading: authLoading } = useAuth();
  const { pageTitle, updatePageTitle } = useSystemSettings();
  const [titleInput, setTitleInput] = useState(pageTitle);

  useEffect(() => {
    setTitleInput(pageTitle);
  }, [pageTitle]);

  const handleLogoUpdate = (newImagePath) => {
    window.dispatchEvent(new CustomEvent('logoUpdated', { detail: newImagePath }));
    // Aguardar um pouco e recarregar as imagens
    setTimeout(() => refreshImages(), 500);
  };

  const handleBackgroundUpdate = (newImagePath) => {
    window.dispatchEvent(new CustomEvent('backgroundUpdated', { detail: newImagePath }));
    setTimeout(() => refreshImages(), 500);
  };

  const handleReset = (imageType) => {
    // Recarregar as imagens após reset
    setTimeout(() => refreshImages(), 500);
  };

  const handleTitleSave = () => {
    if (titleInput.trim()) {
      updatePageTitle(titleInput);
      // Mostrar feedback visual
      const button = document.getElementById('save-title-btn');
      if (button) {
        button.classList.add('bg-green-600');
        setTimeout(() => {
          button.classList.remove('bg-green-600');
        }, 1000);
      }
    }
  };

  // Verificar se usuário tem permissão (perfil S2)
  const hasPermission = user?.role === 'S2';

  if (loading || authLoading) {
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
          {/* Botão Voltar */}
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
                  Você não tem permissão para acessar as configurações de imagens do sistema.
                  <br />
                  Apenas usuários com perfil <strong>S2 (Super Admin)</strong> podem alterar as imagens.
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
        {/* Botão Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar</span>
        </button>

        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaCog className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Configurações do Sistema
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Personalize o logo, imagem de fundo e título da página
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Título da Página */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Título da Página
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Este texto aparece na aba do navegador
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Digite o título da página"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
            <button
              id="save-title-btn"
              onClick={handleTitleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <FaSave />
              Salvar
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Título atual: <strong>{pageTitle}</strong>
          </p>
        </div>

        {/* Gerenciador de Cores */}
        <ColorSchemeManager />

        {/* Gerenciador de Destinos */}
        <DestinationManager />

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <FaInfoCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Informações importantes:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>As imagens são salvas no servidor e visíveis para todos os usuários</li>
                <li>O ícone da aba (favicon) é atualizado automaticamente quando você altera o logo</li>
                <li>Tamanho máximo: 5MB por imagem</li>
                <li>Formatos aceitos: JPEG, PNG, GIF, WEBP</li>
                <li>As alterações são aplicadas imediatamente em todo o sistema</li>
                <li>Use o botão "Restaurar" para voltar às configurações padrão</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gerenciador de Destinos */}
        <DestinationManager />

        {/* Grid de Uploaders e Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Uploaders */}
          <div className="space-y-6">
            <ImageUploader
              title="Logo do Sistema"
              description="Imagem que aparece no cabeçalho e telas de login"
              currentImage={logo}
              imageType="logo"
              onImageUpdate={handleLogoUpdate}
              onReset={handleReset}
            />
            
            <ImageUploader
              title="Imagem de Fundo"
              description="Imagem de fundo das telas de login e páginas públicas"
              currentImage={background}
              imageType="background"
              onImageUpdate={handleBackgroundUpdate}
              onReset={handleReset}
            />
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <PreviewSection 
              logo={logo} 
              background={background} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;