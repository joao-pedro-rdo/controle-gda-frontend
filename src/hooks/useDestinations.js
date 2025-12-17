import { useState, useEffect } from 'react';
import client from '../services/client';

export const useDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await client.get('/settings/destinations');
      setDestinations(response.data.destinations || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar destinos:', err);
      // Se der erro, usa destinos padrão
      setDestinations(getDefaultDestinations());
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addDestination = async (newDestination) => {
    try {
      const response = await client.post('/settings/destinations', {
        name: newDestination
      });
      setDestinations(response.data.destinations || []);
      return { success: true };
    } catch (err) {
      console.error('Erro ao adicionar destino:', err);
      return { success: false, error: err.message };
    }
  };

  const removeDestination = async (destinationName) => {
    try {
      const response = await client.delete(`/settings/destinations/${encodeURIComponent(destinationName)}`);
      setDestinations(response.data.destinations || []);
      return { success: true };
    } catch (err) {
      console.error('Erro ao remover destino:', err);
      return { success: false, error: err.message };
    }
  };

  const resetToDefaults = async () => {
    try {
      const response = await client.post('/settings/destinations/reset');
      setDestinations(response.data.destinations || getDefaultDestinations());
      return { success: true };
    } catch (err) {
      console.error('Erro ao resetar destinos:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return {
    destinations,
    loading,
    error,
    addDestination,
    removeDestination,
    resetToDefaults,
    refetch: fetchDestinations
  };
};

// Destinos padrão
const getDefaultDestinations = () => [
  'RP',
  'SFPC',
  'Cmt',
  'SCmt',
  'Estande',
  'Adj Cmdo',
  'SecInfor',
  'SecJur',
  'S1',
  'S2',
  'S3',
  'S4',
  'Pelotões',
  'SubCias',
  'Outros'
];
