import { useState, useEffect } from 'react';
import client from '../services/client';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const useAppImages = () => {
  const [logo, setLogo] = useState('/img/logo.png');
  const [background, setBackground] = useState('/img/bg-cover.jpg');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentImages();

    // Listener para atualizações
    const handleLogoUpdate = (e) => {
      const logoPath = e.detail.startsWith('http') || e.detail.startsWith('/')
        ? e.detail
        : `${API_BASE_URL}${e.detail}`;
      setLogo(`${logoPath}?t=${Date.now()}`);
    };
    const handleBackgroundUpdate = () => {
      // Background sempre usa bg-cover.jpg
      setBackground(`${API_BASE_URL}/img/bg-cover.jpg?t=${Date.now()}`);
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
      const response = await client.get('/system-images/current');
      const data = response.data;
      
      // Logo: usar o caminho retornado ou padrão
      const logoPath = data.logo 
        ? (data.logo.startsWith('http') || data.logo.startsWith('/img') 
            ? data.logo 
            : `${API_BASE_URL}${data.logo}`)
        : '/img/logo.png';
      
      // Background: sempre usar bg-cover.jpg do servidor
      const backgroundPath = data.background 
        ? (data.background.startsWith('http')
            ? data.background 
            : `${API_BASE_URL}/img/bg-cover.jpg`)
        : `${API_BASE_URL}/img/bg-cover.jpg`;

      setLogo(`${logoPath}?t=${Date.now()}`);
      setBackground(`${backgroundPath}?t=${Date.now()}`);
    } catch (error) {
      console.error('Erro ao carregar imagens do sistema:', error);
      // Manter imagens padrão em caso de erro
      setLogo('/img/logo.png');
      setBackground(`${API_BASE_URL}/img/bg-cover.jpg`);
    } finally {
      setLoading(false);
    }
  };

  const refreshImages = () => {
    fetchCurrentImages();
  };

  return { logo, background, loading, refreshImages };
};