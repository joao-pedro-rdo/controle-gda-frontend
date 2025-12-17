import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata a data de entrada do input para o formato da API
 */
export const formatDateForAPI = (dateString) => {
  if (!dateString) return null;

  const inputDate = new Date(dateString);
  
  // Data inicial: dia selecionado às 08:00 (início do serviço)
  const initialDate = new Date(dateString).setHours(inputDate.getHours() + 11);
  const initialToRequest = new Date(initialDate).toISOString();

  // Data final: dia seguinte às 08:00 (fim do serviço)
  const finalDate = new Date(dateString).setHours(inputDate.getHours() + 35);
  const finalDateToRequest = new Date(finalDate).toISOString();

  return { initialToRequest, finalDateToRequest };
};

/**
 * Determina o tipo de usuário baseado nas flags
 */
export const getUserType = (entry) => {
  if (entry.isPermissionario) return 'Permissionário';
  if (entry.isVisitor) return 'Visitante';
  return 'Militar';
};

/**
 * Filtra os dados baseado no termo de pesquisa
 */
export const filterBySearchTerm = (data, searchTerm) => {
  if (!data || !searchTerm) return data;
  
  const term = searchTerm.toLowerCase();
  
  return data.filter((item) =>
    (item.name && item.name.toLowerCase().includes(term)) ||
    (item.licensePlate && item.licensePlate.toLowerCase().includes(term)) ||
    (item.color && item.color.toLowerCase().includes(term)) ||
    (item.target && item.target.toLowerCase().includes(term)) ||
    (item.carModel && item.carModel.toLowerCase().includes(term)) ||
    (item.contactPerson && item.contactPerson.toLowerCase().includes(term)) ||
    (item.idNumber && item.idNumber.toLowerCase().includes(term)) ||
    (item.CPF && item.CPF.toLowerCase().includes(term))
  );
};

/**
 * Filtra os dados por tipo de usuário
 */
export const filterByUserType = (data, filterType) => {
  if (!data) return data;

  switch (filterType) {
    case '1': // Todos
      return data;
    case '2': // Visitantes
      return data.filter((entry) => entry.isVisitor && !entry.isPermissionario);
    case '3': // Militares
      return data.filter((entry) => !entry.isVisitor && !entry.isPermissionario);
    case '4': // Permissionários
      return data.filter((entry) => entry.isPermissionario);
    default:
      return data;
  }
};

/**
 * Formata os dados para exportação Excel
 */
export const formatDataForExcel = (entries) => {
  const visitors = entries.filter((entry) => entry.isVisitor && !entry.isPermissionario);
  const military = entries.filter((entry) => !entry.isVisitor && !entry.isPermissionario);
  const permissionarios = entries.filter((entry) => entry.isPermissionario);

  const formatVisitors = visitors
    .map((visitor) => ({
      datetime: new Date(visitor.time),
      day: format(new Date(visitor.time), 'dd/MM/yyyy'),
      name: visitor.name,
      idNumber: visitor.idNumber,
      phoneNumber: visitor.phoneNumber,
      car: `${visitor.carModel} - ${visitor.color}`,
      licensePlate: visitor.licensePlate,
      type: visitor.type,
      time: format(new Date(visitor.time), 'HH:mm:ss'),
      target: visitor.target,
      contactPerson: visitor.contactPerson,
    }))
    .sort((a, b) => a.datetime - b.datetime);

  const formatMilitary = military
    .map((entry) => ({
      datetime: new Date(entry.time),
      day: format(new Date(entry.time), 'dd/MM/yyyy'),
      name: entry.name,
      idNumber: entry.idNumber,
      car: `${entry.carModel} - ${entry.color}`,
      licensePlate: entry.licensePlate,
      type: entry.type,
      time: format(new Date(entry.time), 'HH:mm:ss'),
    }))
    .sort((a, b) => a.datetime - b.datetime);

  const formatPermissionarios = permissionarios
    .map((entry) => ({
      datetime: new Date(entry.time),
      day: format(new Date(entry.time), 'dd/MM/yyyy'),
      name: entry.name,
      idNumber: entry.idNumber,
      CPF: entry.CPF || 'N/A',
      carModel: entry.carModel || 'N/A',
      licensePlate: entry.licensePlate || 'N/A',
      color: entry.color || 'N/A',
      type: entry.type,
      time: format(new Date(entry.time), 'HH:mm:ss'),
      hasPhoto: entry.imagePath ? 'Sim' : 'Não',
    }))
    .sort((a, b) => a.datetime - b.datetime);

  return {
    visitors: formatVisitors,
    military: formatMilitary,
    permissionarios: formatPermissionarios,
  };
};
