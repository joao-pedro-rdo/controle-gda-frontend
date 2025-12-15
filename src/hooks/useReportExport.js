import { useState } from 'react';
import { format } from 'date-fns';
import client from '../services/client';
import { formatDataForExcel } from '../utils/reportHelpers';

export const useReportExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = async () => {
    setIsExporting(true);

    try {
      const entriesResponse = await client.get('/entries');
      const allEntries = entriesResponse.data;

      const { visitors, military, permissionarios } = formatDataForExcel(allEntries);

      const xlsx = require('json-as-xlsx');
      
      const dataToExport = [
        {
          sheet: 'Visitantes',
          columns: [
            { label: 'Dia', value: 'day' },
            { label: 'Nome', value: 'name' },
            { label: 'Identidade', value: 'idNumber' },
            { label: 'Telefone', value: 'phoneNumber' },
            { label: 'Carro - Cor', value: 'car' },
            { label: 'Placa', value: 'licensePlate' },
            { label: 'Entrada/Saída', value: 'type' },
            { label: 'Hora', value: 'time' },
            { label: 'Destino', value: 'target' },
            { label: 'Pessoa de Contato', value: 'contactPerson' },
          ],
          content: visitors,
        },
        {
          sheet: 'Militares',
          columns: [
            { label: 'Dia', value: 'day' },
            { label: 'Militar', value: 'name' },
            { label: 'Identidade', value: 'idNumber' },
            { label: 'Carro - Cor', value: 'car' },
            { label: 'Placa', value: 'licensePlate' },
            { label: 'Entrada/Saída', value: 'type' },
            { label: 'Hora', value: 'time' },
          ],
          content: military,
        },
        {
          sheet: 'Permissionários',
          columns: [
            { label: 'Dia', value: 'day' },
            { label: 'Nome', value: 'name' },
            { label: 'Identidade', value: 'idNumber' },
            { label: 'CPF', value: 'CPF' },
            { label: 'Veículo', value: 'carModel' },
            { label: 'Placa', value: 'licensePlate' },
            { label: 'Cor', value: 'color' },
            { label: 'Entrada/Saída', value: 'type' },
            { label: 'Hora', value: 'time' },
            { label: 'Tem Foto', value: 'hasPhoto' },
          ],
          content: permissionarios,
        },
      ];

      const settings = {
        fileName: `Relatório gerado dia ${format(new Date(), 'dd/MM/yyyy')}`,
        extraLength: 3,
        writeOptions: {},
      };

      xlsx(dataToExport, settings);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportToExcel,
  };
};
