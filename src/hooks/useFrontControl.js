import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import client from '../services/client';
import { useEntryRegistration } from './useEntryRegistration';

export const useFrontControl = (scanResult, setIsProcessing) => {
  const [authorized, setAuthorized] = useState(null);
  const [mission, setMission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [hasApiResponse, setHasApiResponse] = useState(false);
  const toast = useToast();
  const { handleVehicleEntry, handlePermissionarioEntry } = useEntryRegistration();

  useEffect(() => {
    if (!scanResult) return;

    console.log('Processando scanResult:', scanResult);
    setHasApiResponse(false);
    setAuthorized(null);

    const processQRCode = async () => {
      // QR de permissionário
      if (scanResult?.permissionario && typeof scanResult.permissionario === 'string') {
        setIsLoading(true);
        setLoadingMessage('Validando permissionário...');

        try {
          const response = await client.get(`/permissionarioByCPF/${scanResult.permissionario}`);
          
          if (response.data?.completeName) {
            const permissionarioData = {
              ...response.data,
              isPermissionario: true,
              type: 'permissionario',
            };
            setAuthorized(permissionarioData);
            setHasApiResponse(true);
            
            const success = await handlePermissionarioEntry(permissionarioData);
            if (!success) setIsProcessing(false);
          }
        } catch (error) {
          console.error('Erro ao buscar permissionário:', error);
          setHasApiResponse(true);
          setAuthorized(null);
          toast({
            title: 'Permissionário não encontrado',
            description: 'O permissionário com este CPF não está registrado no sistema',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          setIsProcessing(false);
        } finally {
          setIsLoading(false);
          setLoadingMessage('');
        }
      }
      // QR de veículo
      else if (scanResult?.licensePlate && typeof scanResult.licensePlate === 'string') {
        setIsLoading(true);
        setLoadingMessage('Validando veículo...');

        try {
          const response = await client.get(`/vehiclebyplate/${scanResult.licensePlate}`);
          
          if (response.data?.tagName) {
            const vehicleData = {
              ...response.data,
              isPermissionario: false,
              type: 'veiculo',
            };
            setAuthorized(vehicleData);
            setHasApiResponse(true);
            
            const success = await handleVehicleEntry(vehicleData);
            if (!success) setIsProcessing(false);
          }
        } catch (error) {
          console.error('Erro ao buscar veículo:', error);
          setHasApiResponse(true);
          setAuthorized(null);
          toast({
            title: 'Veículo não encontrado',
            description: 'O veículo com esta placa não está registrado no sistema',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setIsProcessing(false);
        } finally {
          setIsLoading(false);
          setLoadingMessage('');
        }
      }
      // QR de missão
      else if (scanResult?.mission) {
        setIsLoading(true);
        setLoadingMessage('Carregando missão...');

        try {
          const response = await client.get(`/missions/${scanResult.mission}`);
          setMission(response.data);
          setHasApiResponse(true);
        } catch (error) {
          console.error('Erro ao buscar missão:', error);
          setHasApiResponse(true);
        } finally {
          setIsLoading(false);
          setLoadingMessage('');
        }
      }
    };

    processQRCode();
  }, [scanResult]);

  return {
    authorized,
    mission,
    setMission,
    isLoading,
    loadingMessage,
    hasApiResponse,
  };
};
