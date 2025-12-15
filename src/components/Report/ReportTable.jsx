import { Box, Table, Thead, Th, Tr, Tbody, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styled from 'styled-components';
import ReportTableRow from './ReportTableRow';

const SText = styled(Text)`
  display: none;
  font-size: 1.2rem;
  font-weight: 700;

  @media print {
    display: flex;
  }
`;

const STable = styled(Table)`
  table-layout: fixed;
  width: 100%;

  @media print {
    font-size: 8px; 
  }
`;

const ReportTable = ({ data, dateRange }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum registro encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Selecione um período para visualizar os registros.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header com informações do período */}
      {dateRange && (
        <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4 print:block hidden">
          <h2 className="text-lg font-semibold text-gray-900">
            Relatório do período
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {format(new Date(dateRange.startDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às{' '}
            {dateRange.startTime} até{' '}
            {format(new Date(dateRange.endDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às{' '}
            {dateRange.endTime}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Total de registros: <span className="font-semibold">{data.length}</span>
          </p>
        </div>
      )}

      {/* Informações resumidas - apenas tela */}
      <div className="mb-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm text-gray-600">
              Total de registros encontrados:
            </p>
            <p className="text-2xl font-bold text-red-600">{data.length}</p>
          </div>
          {dateRange && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Período selecionado:</p>
              <p className="text-sm font-medium text-gray-700">
                {format(new Date(dateRange.startDate), 'dd/MM/yyyy', { locale: ptBR })} {dateRange.startTime} -{' '}
                {format(new Date(dateRange.endDate), 'dd/MM/yyyy', { locale: ptBR })} {dateRange.endTime}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabela - Desktop */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Foto
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Identidade
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Placa
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Veículo
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destino
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((entry) => (
              <ReportTableRow key={entry.id} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {data.map((entry) => (
          <ReportTableRow key={entry.id} entry={entry} mobile />
        ))}
      </div>
    </div>
  );
};

export default ReportTable;
