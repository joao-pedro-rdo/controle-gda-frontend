import { useState, useEffect } from 'react';
import client from '../services/client';

export const useColors = () => {
  const [primaryColor, setPrimaryColor] = useState('#dc2626'); // red-600
  const [secondaryColor, setSecondaryColor] = useState('#991b1b'); // red-800
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadColors();

    // Listener para atualizações
    const handleColorsUpdate = (e) => {
      setPrimaryColor(e.detail.primaryColor);
      setSecondaryColor(e.detail.secondaryColor);
    };

    window.addEventListener('colorsUpdated', handleColorsUpdate);
    
    return () => {
      window.removeEventListener('colorsUpdated', handleColorsUpdate);
    };
  }, []);

  const loadColors = async () => {
    try {
      const response = await client.get('/settings/colors');
      if (response.data) {
        setPrimaryColor(response.data.primaryColor || '#dc2626');
        setSecondaryColor(response.data.secondaryColor || '#991b1b');
      }
    } catch (error) {
      console.error('Erro ao carregar cores:', error);
      // Fallback para localStorage
      const savedPrimary = localStorage.getItem('systemPrimaryColor');
      const savedSecondary = localStorage.getItem('systemSecondaryColor');
      if (savedPrimary) setPrimaryColor(savedPrimary);
      if (savedSecondary) setSecondaryColor(savedSecondary);
    } finally {
      setLoading(false);
    }
  };

  const updateColors = async (primary, secondary) => {
    try {
      await client.post('/settings/colors', {
        primaryColor: primary,
        secondaryColor: secondary
      });

      localStorage.setItem('systemPrimaryColor', primary);
      localStorage.setItem('systemSecondaryColor', secondary);

      setPrimaryColor(primary);
      setSecondaryColor(secondary);

      window.dispatchEvent(new CustomEvent('colorsUpdated', { 
        detail: { primaryColor: primary, secondaryColor: secondary } 
      }));

      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar cores:', error);
      // Salvar localmente mesmo se falhar
      localStorage.setItem('systemPrimaryColor', primary);
      localStorage.setItem('systemSecondaryColor', secondary);
      
      setPrimaryColor(primary);
      setSecondaryColor(secondary);
      
      window.dispatchEvent(new CustomEvent('colorsUpdated', { 
        detail: { primaryColor: primary, secondaryColor: secondary } 
      }));

      return { success: true, fallback: true };
    }
  };

  const resetColors = async () => {
    return updateColors('#dc2626', '#991b1b');
  };

  return {
    primaryColor,
    secondaryColor,
    loading,
    updateColors,
    resetColors
  };
};
