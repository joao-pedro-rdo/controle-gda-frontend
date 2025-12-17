import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000';

export const useAppImages = () => {
  const [logo, setLogo] = useState('/img/logo.png');
  const [background, setBackground] = useState('/img/background.jpg');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentImages();

    // Listener para atualizações
    const handleLogoUpdate = (e) => {
      setLogo(`${API_BASE_URL}${e.detail}?t=${Date.now()}`);
    };
    const handleBackgroundUpdate = (e) => {
      setBackground(`${API_BASE_URL}${e.detail}?t=${Date.now()}`);
    };

    window.addEventListener('logoUpdated', handleLogoUpdate);
    window.addEventListener('backgroundUpdated', handleBackgroundUpdate);

    return () => {
      window.removeEventListener('logoUpdated', handleLogoUpdate);
      window.removeEventListener('backgroundUpdated', handleBackgroundUpdate);
    };
  }, []);

  const fetchCurrentImages = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/system-images/current`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });

      if (response.ok) {
        const data = await response.json();
        
        // Se retornar null, usar imagens padrão
        const logoPath = data.logo 
          ? `${API_BASE_URL}${data.logo}?t=${Date.now()}` 
          : '/img/logo.png';
        
        const backgroundPath = data.background 
          ? `${API_BASE_URL}${data.background}?t=${Date.now()}` 
          : '/img/background.jpg';

        setLogo(logoPath);
        setBackground(backgroundPath);
      }
    } catch (error) {
      console.error('Erro ao carregar imagens do sistema:', error);
      // Manter imagens padrão em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const refreshImages = () => {
    fetchCurrentImages();
  };

  return { logo, background, loading, refreshImages };
};