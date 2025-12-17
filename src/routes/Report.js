import {
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  Box,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Button,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import client from "../services/client.js";
import Navbar from "../components/Navbar";
import { format } from "date-fns";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext.js";
import Unauthorized from "../components/Unauthorized/index.js";
import { ptBR } from "date-fns/locale";
import VisitorImage from "../components/VisitorImage";

// Hooks customizados
import { useReport } from "../hooks/useReport";
import { useReportFilters } from "../hooks/useReportFilters";
import { useReportExport } from "../hooks/useReportExport";

// Componentes
import ReportFilters from "../components/Report/ReportFilters";
import ReportTable from "../components/Report/ReportTable";

const Report = () => {
  const auth = useAuth();
  const toast = useToast();

  // Hook principal de relatório (já carrega automaticamente as últimas 24h)
  const { dateRange, report, isLoading, error, handleDateRangeChange } = useReport();

  // Hook de filtros
  const { filterType, filteredData, handleSearch, handleFilterChange } = useReportFilters(report);

  // Hook de exportação
  const { isExporting, exportToExcel } = useReportExport();

  // Handler para exportação com feedback
  const handleExport = async () => {
    try {
      await exportToExcel();
      toast({
        title: "Exportação concluída",
        description: "O arquivo Excel foi gerado com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo Excel",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Verificar permissão do usuário
  const hasAccess =
    auth.user.role === "S2" || auth.user.role === "Scmt" || auth.user.role === "Ofdia";
  const canExport = auth.user.role === "Scmt" || auth.user.role === "S2";

  if (!hasAccess) return <Unauthorized />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            📊 Relatório de Entradas e Saídas
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Consulte e exporte registros por período personalizado
          </p>
        </div>
      </div>

      {/* Filtros - Passar o dateRange atual */}
      <ReportFilters
        onDateRangeChange={handleDateRangeChange}
        onSearchChange={handleSearch}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        canExport={canExport}
        isExporting={isExporting}
        filterValue={filterType}
        initialDateRange={dateRange}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Carregando relatório...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">❌ Erro ao carregar dados: {error}</p>
          </div>
        </div>
      )}

      {/* Tabela de dados */}
      {!isLoading && !error && (
        <ReportTable data={filteredData} dateRange={dateRange} />
      )}
    </div>
  );
};

export default Report;
