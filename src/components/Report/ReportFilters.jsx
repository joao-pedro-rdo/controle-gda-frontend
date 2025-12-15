import { useState, useEffect } from 'react';
import { Button, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import styled from 'styled-components';

const SFormControl = styled.form`
  @media print {
    display: none;
  }
`;

const ReportFilters = ({
  onDateRangeChange,
  onSearchChange,
  onFilterChange,
  onExport,
  canExport,
  isExporting,
  filterValue = '1',
  initialDateRange, // Receber o range inicial
}) => {
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

  // Usar o range inicial ou o padrão
  const defaultRange = initialDateRange || getDefaultDateRange();

  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  const [startTime, setStartTime] = useState(defaultRange.startTime);
  const [endTime, setEndTime] = useState(defaultRange.endTime);

  // Atualizar os estados quando o initialDateRange mudar
  useEffect(() => {
    if (initialDateRange) {
      setStartDate(initialDateRange.startDate);
      setEndDate(initialDateRange.endDate);
      setStartTime(initialDateRange.startTime);
      setEndTime(initialDateRange.endTime);
    }
  }, [initialDateRange]);

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      onDateRangeChange({
        startDate,
        endDate,
        startTime,
        endTime,
      });
    }
  };

  const handleReset = () => {
    const defaultRange = getDefaultDateRange();
    setStartDate(defaultRange.startDate);
    setEndDate(defaultRange.endDate);
    setStartTime(defaultRange.startTime);
    setEndTime(defaultRange.endTime);
    onDateRangeChange(defaultRange);
  };

  return (
    <SFormControl>
      <div className="bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Info sobre período padrão */}
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              ℹ️ <strong>Período padrão:</strong> Últimas 24 horas. Ajuste conforme necessário.
            </p>
          </div>

          {/* Filtros de Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Data Inicial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Hora Inicial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora Inicial
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Data Final */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Hora Final */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora Final
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button
              onClick={handleApplyFilter}
              colorScheme="red"
              size={{ base: 'md', md: 'md' }}
              isDisabled={!startDate || !endDate}
              className="flex-1 sm:flex-initial"
            >
              🔍 Aplicar Filtro
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              colorScheme="gray"
              size={{ base: 'md', md: 'md' }}
              className="flex-1 sm:flex-initial"
            >
              🔄 Últimas 24h
            </Button>
          </div>

          {/* Linha de Separação */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Pesquisa e Filtros de Tipo */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Campo de Pesquisa */}
            <div className="w-full lg:w-96">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesquisar
              </label>
              <input
                type="text"
                placeholder="Nome, placa, CPF, identidade..."
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Filtros de Tipo */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por tipo
              </label>
              <RadioGroup onChange={onFilterChange} value={filterValue}>
                <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                  <Radio value="1" colorScheme="red">
                    <span className="text-sm">Todos</span>
                  </Radio>
                  <Radio value="2" colorScheme="red">
                    <span className="text-sm">Visitantes</span>
                  </Radio>
                  <Radio value="3" colorScheme="red">
                    <span className="text-sm">Militares</span>
                  </Radio>
                  <Radio value="4" colorScheme="red">
                    <span className="text-sm">Permissionários</span>
                  </Radio>
                </Stack>
              </RadioGroup>
            </div>

            {/* Botão Exportar */}
            {canExport && (
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2 invisible">
                  Ações
                </label>
                <Button
                  onClick={onExport}
                  colorScheme="green"
                  size={{ base: 'md', md: 'md' }}
                  isLoading={isExporting}
                  loadingText="Exportando..."
                  className="w-full lg:w-auto"
                >
                  📊 Exportar Excel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </SFormControl>
  );
};

export default ReportFilters;
