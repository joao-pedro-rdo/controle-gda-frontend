import { useState, useEffect } from 'react';
import client from '../services/client';

export const useSystemSettings = () => {
  const [logo, setLogo] = useState('/img/logo.png');
  const [background, setBackground] = useState('/img/bg-cover.jpg');
  const [pageTitle, setPageTitle] = useState('Guarda - 6° RCB');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Tenta buscar do backend
      const response = await client.get('/settings/system');
      const settings = response.data;
      
      if (settings.pageTitle) {
        setPageTitle(settings.pageTitle);
        document.title = settings.pageTitle;
      }
      if (settings.logo) {
        setLogo(settings.logo);
        updateFavicon(settings.logo);
      }
      if (settings.background) {
        setBackground(settings.background);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações do backend:', error);
      // Fallback para localStorage se o backend falhar
      const savedLogo = localStorage.getItem('systemLogo');
      const savedBackground = localStorage.getItem('systemBackground');
      const savedTitle = localStorage.getItem('systemPageTitle');

      if (savedLogo) setLogo(savedLogo);
      if (savedBackground) setBackground(savedBackground);
      if (savedTitle) {
        setPageTitle(savedTitle);
        document.title = savedTitle;
      }
    } finally {
      setLoading(false);
    }
  };

  const updateLogo = async (newLogo) => {
    try {
      await client.post('/settings/system', { logo: newLogo });
      setLogo(newLogo);
      localStorage.setItem('systemLogo', newLogo);
      updateFavicon(newLogo);
    } catch (error) {
      console.error('Erro ao salvar logo no backend:', error);
      // Salva localmente mesmo se falhar no backend
      setLogo(newLogo);
      localStorage.setItem('systemLogo', newLogo);
      updateFavicon(newLogo);
    }
  };

  const updateBackground = async (newBackground) => {
    try {
      await client.post('/settings/system', { background: newBackground });
      setBackground(newBackground);
      localStorage.setItem('systemBackground', newBackground);
    } catch (error) {
      console.error('Erro ao salvar background no backend:', error);
      setBackground(newBackground);
      localStorage.setItem('systemBackground', newBackground);
    }
  };

  const updatePageTitle = async (newTitle) => {
    try {
      await client.post('/settings/system', { pageTitle: newTitle });
      setPageTitle(newTitle);
      localStorage.setItem('systemPageTitle', newTitle);
      document.title = newTitle;
    } catch (error) {
      console.error('Erro ao salvar título no backend:', error);
      setPageTitle(newTitle);
      localStorage.setItem('systemPageTitle', newTitle);
      document.title = newTitle;
    }
  };

  const updateFavicon = (logoUrl) => {
    // Remove favicons antigos
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(icon => icon.remove());

    // Adiciona novo favicon
    const link = document.createElement('link');
    link.rel = 'shortcut icon';
    link.type = 'image/x-icon';
    link.href = logoUrl;
    document.head.appendChild(link);
  };

  const resetToDefaults = async () => {
    try {
      await client.post('/settings/system/reset');
      setLogo('/img/logo.png');
      setBackground('/img/bg-cover.jpg');
      setPageTitle('Guarda - 6° RCB');
      localStorage.removeItem('systemLogo');
      localStorage.removeItem('systemBackground');
      localStorage.removeItem('systemPageTitle');
      document.title = 'Guarda - 6° RCB';
      updateFavicon('/img/logo.png');
    } catch (error) {
      console.error('Erro ao resetar configurações no backend:', error);
      setLogo('/img/logo.png');
      setBackground('/img/bg-cover.jpg');
      setPageTitle('Guarda - 6° RCB');
      localStorage.removeItem('systemLogo');
      localStorage.removeItem('systemBackground');
      localStorage.removeItem('systemPageTitle');
      document.title = 'Guarda - 6° RCB';
      updateFavicon('/img/logo.png');
    }
  };

  return {
    logo,
    background,
    pageTitle,
    loading,
    updateLogo,
    updateBackground,
    updatePageTitle,
    resetToDefaults,
  };
};