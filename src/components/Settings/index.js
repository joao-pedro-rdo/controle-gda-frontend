import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ImageUploader from './ImageUploader';
import PreviewSection from './PreviewSection';

const Settings = () => {
  const [logoFile, setLogoFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [currentLogo, setCurrentLogo] = useState('/img/logo.png');
  const [currentBackground, setCurrentBackground] = useState('/img/background.jpg');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carrega as configurações atuais
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = () => {
    // Aqui você pode buscar as configurações atuais da API
    // Por enquanto, usando valores padrão
    const savedLogo = localStorage.getItem('systemLogo') || '/img/logo.png';
    const savedBackground = localStorage.getItem('systemBackground') || '/img/background.jpg';
    
    setCurrentLogo(savedLogo);
    setCurrentBackground(savedBackground);
  };

  const handleLogoChange = (file) => {
    setLogoFile(file);
  };

  const handleBackgroundChange = (file) => {
    setBackgroundFile(file);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      if (backgroundFile) {
        formData.append('background', backgroundFile);
      }

      // Simular upload - substitua pela sua API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar localStorage (substitua pela lógica da sua API)
      if (logoFile) {
        const logoUrl = URL.createObjectURL(logoFile);
        localStorage.setItem('systemLogo', logoUrl);
        setCurrentLogo(logoUrl);
      }
      
      if (backgroundFile) {
        const backgroundUrl = URL.createObjectURL(backgroundFile);
        localStorage.setItem('systemBackground', backgroundUrl);
        setCurrentBackground(backgroundUrl);
      }

      toast.success('Configurações salvas com sucesso!');
      setLogoFile(null);
      setBackgroundFile(null);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setLogoFile(null);
    setBackgroundFile(null);
    setCurrentLogo('/img/logo.png');
    setCurrentBackground('/img/background.jpg');
    localStorage.removeItem('systemLogo');
    localStorage.removeItem('systemBackground');
    toast.info('Configurações resetadas para o padrão');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
            <p className="mt-1 text-sm text-gray-600">
              Personalize a aparência do seu sistema alterando o logo e a imagem de fundo
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Seção de Upload */}
              <div className="space-y-6">
                <ImageUploader
                  title="Logo do Sistema"
                  description="Faça upload de um novo logo (PNG, JPG até 2MB)"
                  currentImage={currentLogo}
                  onFileChange={handleLogoChange}
                  selectedFile={logoFile}
                  accept="image/png,image/jpeg"
                  maxSize={2}
                />

                <ImageUploader
                  title="Imagem de Fundo"
                  description="Faça upload de uma nova imagem de fundo (PNG, JPG até 5MB)"
                  currentImage={currentBackground}
                  onFileChange={handleBackgroundChange}
                  selectedFile={backgroundFile}
                  accept="image/png,image/jpeg"
                  maxSize={5}
                />
              </div>

              {/* Seção de Preview */}
              <PreviewSection
                logo={logoFile ? URL.createObjectURL(logoFile) : currentLogo}
                background={backgroundFile ? URL.createObjectURL(backgroundFile) : currentBackground}
              />
            </div>

            {/* Botões de Ação */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Resetar
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || (!logoFile && !backgroundFile)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </div>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;