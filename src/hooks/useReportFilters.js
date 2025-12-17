import { useState, useEffect, useMemo } from 'react';
import { filterBySearchTerm, filterByUserType } from '../utils/reportHelpers';

export const useReportFilters = (reportData) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('1'); // '1' = Todos

  // Usa useMemo para evitar recalcular a filtragem desnecessariamente
  const filteredData = useMemo(() => {
    if (!reportData) return null;

    // Primeiro filtra por tipo de usuário
    let filtered = filterByUserType(reportData, filterType);
    
    // Depois aplica o filtro de pesquisa
    filtered = filterBySearchTerm(filtered, searchTerm);

    return filtered;
  }, [reportData, searchTerm, filterType]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('1');
  };

  return {
    searchTerm,
    filterType,
    filteredData,
    handleSearch,
    handleFilterChange,
    resetFilters,
  };
};
