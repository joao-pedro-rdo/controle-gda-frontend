import { useState, useEffect } from 'react';
import client from '../services/client';

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
        : `/img/${e.detail}`;
      setLogo(`${logoPath}?t=${Date.now()}`);
    };
    const handleBackgroundUpdate = () => {
      // Background sempre usa bg-cover.jpg
      setBackground(`/img/bg-cover.jpg?t=${Date.now()}`);
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
            : `/img/${data.logo}`)
        : '/img/logo.png';
      
      // Background: sempre usar bg-cover.jpg
      const backgroundPath = '/img/bg-cover.jpg';

      setLogo(`${logoPath}?t=${Date.now()}`);
      setBackground(`${backgroundPath}?t=${Date.now()}`);
    } catch (error) {
      console.error('Erro ao carregar imagens do sistema:', error);
      // Manter imagens padrão em caso de erro
      setLogo('/img/logo.png');
      setBackground('/img/bg-cover.jpg');
    } finally {
      setLoading(false);
    }
  };

  const refreshImages = () => {
    fetchCurrentImages();
  };

  return { logo, background, loading, refreshImages };
};