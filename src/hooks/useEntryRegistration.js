import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import client from '../services/client';

export const useEntryRegistration = () => {
  const [recentEntries, setRecentEntries] = useState(new Map());
  const toast = useToast();

  const checkRecentEntry = (identifier) => {
    const now = Date.now();
    const lastEntry = recentEntries.get(identifier);

    if (lastEntry && now - lastEntry < 45000) {
      console.log('⚠️ Entrada recente detectada para:', identifier);
      return true;
    }

    setRecentEntries((prev) => new Map(prev.set(identifier, now)));

    setTimeout(() => {
      setRecentEntries((prev) => {
        const newMap = new Map(prev);
        for (const [key, timestamp] of newMap) {
          if (now - timestamp > 60000) {
            newMap.delete(key);
          }
        }
        return newMap;
      });
    }, 1000);

    return false;
  };

  const handleVehicleEntry = async (vehicleData) => {
    try {
      const identifier = vehicleData.licensePlate;

      if (checkRecentEntry(identifier)) {
        toast({
          title: 'Entrada já registrada',
          description: 'Aguarde 45 segundos antes de escanear novamente',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }

      const submitData = new FormData();
      submitData.append('name', vehicleData.tagName || '');
      submitData.append('type', 'Entrada');
      submitData.append('isVisitor', 'false');
      submitData.append('isPermissionario', 'false');
      submitData.append('idNumber', vehicleData.idNumber || '');
      submitData.append('licensePlate', vehicleData.licensePlate || '');
      submitData.append('carModel', vehicleData.carModel || '');
      submitData.append('color', vehicleData.color || '');
      submitData.append('phoneNumber', '');
      submitData.append('contactPerson', '');
      submitData.append('target', vehicleData.section || vehicleData.company || '');

      const response = await client.post('/entries', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast({
        title: 'Entrada Registrada',
        description: `${vehicleData.tagName} - ${vehicleData.licensePlate}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      return true;
    } catch (error) {
      console.error('❌ Erro ao registrar entrada:', error);
      toast({
        title: 'Erro ao registrar entrada',
        description: error.response?.data?.message || 'Tente novamente',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };

  const handlePermissionarioEntry = async (permissionario) => {
    try {
      const identifier = permissionario.CPF;

      if (checkRecentEntry(identifier)) {
        toast({
          title: 'Entrada já registrada',
          description: 'Aguarde 45 segundos antes de escanear novamente',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }

      const submitData = new FormData();
      submitData.append('name', permissionario.completeName || '');
      submitData.append('type', 'Entrada');
      submitData.append('isVisitor', 'false');
      submitData.append('isPermissionario', 'true');
      submitData.append('idNumber', permissionario.idNumber || '');
      submitData.append('CPF', permissionario.CPF || '');
      submitData.append('licensePlate', permissionario.licensePlate || 'N/A');
      submitData.append('carModel', permissionario.carModel || 'N/A');
      submitData.append('color', permissionario.color || 'N/A');
      submitData.append('phoneNumber', permissionario.phoneNumber || '');
      submitData.append('contactPerson', '');
      submitData.append('target', permissionario.local || '');

      const response = await client.post('/entries', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast({
        title: 'Entrada Registrada',
        description: `${permissionario.completeName} - Permissionário`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      return true;
    } catch (error) {
      console.error('❌ Erro ao registrar entrada de permissionário:', error);
      toast({
        title: 'Erro ao registrar entrada',
        description: error.response?.data?.message || 'Tente novamente',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };

  return {
    handleVehicleEntry,
    handlePermissionarioEntry,
  };
};
