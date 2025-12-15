import { useState, useEffect } from 'react';

export const useSystemSettings = () => {
  const [logo, setLogo] = useState('/img/logo.png');
  const [background, setBackground] = useState('/img/background.jpg');

  useEffect(() => {
    // Carrega configurações do localStorage ou API
    const savedLogo = localStorage.getItem('systemLogo');
    const savedBackground = localStorage.getItem('systemBackground');

    if (savedLogo) setLogo(savedLogo);
    if (savedBackground) setBackground(savedBackground);
  }, []);

  const updateLogo = (newLogo) => {
    setLogo(newLogo);
    localStorage.setItem('systemLogo', newLogo);
  };

  const updateBackground = (newBackground) => {
    setBackground(newBackground);
    localStorage.setItem('systemBackground', newBackground);
  };

  const resetToDefaults = () => {
    setLogo('/img/logo.png');
    setBackground('/img/background.jpg');
    localStorage.removeItem('systemLogo');
    localStorage.removeItem('systemBackground');
  };

  return {
    logo,
    background,
    updateLogo,
    updateBackground,
    resetToDefaults,
  };
};