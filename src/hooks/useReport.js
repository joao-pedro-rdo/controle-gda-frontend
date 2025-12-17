import { useState, useEffect } from 'react';
import client from '../services/client';

export const useReport = () => {
  const [dateRange, setDateRange] = useState(null);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para obter o range padrão (últimas 24 horas)
  const getDefaultDateRange = () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return {
      startDate: yesterday.toISOString().split('T')[0],
      startTime: now.toTimeString().slice(0, 5),
      endDate: now.toISOString().split('T')[0],
      endTime: now.toTimeString().slice(0, 5),
    };
  };

  const fetchReport = async ({ startDate, endDate, startTime, endTime }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Combinar data e hora para criar ISO string
      const initialDateTime = new Date(`${startDate}T${startTime}:00`);
      const finalDateTime = new Date(`${endDate}T${endTime}:00`);

      const response = await client.post('/entries/byDate', {
        initialDate: initialDateTime.toISOString(),
        finalDate: finalDateTime.toISOString(),
      });

      setReport(response.data);
      setDateRange({ startDate, endDate, startTime, endTime });
    } catch (err) {
      console.error('Erro ao buscar registros:', err);
      setError(err.message || 'Erro ao buscar dados');
      setReport([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    fetchReport(range);
  };

  // Carregar automaticamente as últimas 24 horas ao montar o componente
  useEffect(() => {
    const defaultRange = getDefaultDateRange();
    fetchReport(defaultRange);
  }, []); // Array vazio = executa apenas uma vez ao montar

  return {
    dateRange,
    report,
    isLoading,
    error,
    handleDateRangeChange,
    refetch: () => dateRange && fetchReport(dateRange),
    getDefaultDateRange, // Exportar para usar no componente de filtros
  };
};
