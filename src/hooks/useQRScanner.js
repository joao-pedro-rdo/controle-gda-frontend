import { useState, useRef, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

export const useQRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useCameraScanner, setUseCameraScanner] = useState(false);
  const [rawQrData, setRawQrData] = useState(null);
  const [message, setMessage] = useState('Operando pelo Leitor');
  const inputRef = useRef(null);
  const toast = useToast();

  // Focus no input do leitor físico
  useEffect(() => {
    if (!useCameraScanner && inputRef.current) {
      inputRef.current.focus();
      const handleBlur = () => {
        setTimeout(() => {
          setMessage('Atualize a página para operar pelo Leitor');
        }, 5000);
      };

      inputRef.current.addEventListener('blur', handleBlur);

      return () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener('blur', handleBlur);
        }
      };
    }
  }, [useCameraScanner]);

  // Handler para câmera
  const handleScanWebCam = (result, rawText) => {
    setRawQrData(rawText);
    console.log('QR code lido via câmera:', result);

    if (result && !isProcessing) {
      setIsProcessing(true);
      setScanResult(result);
    }
  };

  // Handler para leitor físico
  const handleInputChange = () => {
    const currentValue = inputRef.current.value;
    console.log('Entrada do leitor físico:', currentValue);

    // Verificação de bateria
    if (currentValue.length === 3 && currentValue[0] >= 0) {
      toast({
        title: `${currentValue} de Bateria`,
        status: 'info',
        duration: 9000,
        isClosable: true,
      });
      inputRef.current.value = null;
      return;
    }

    // QR codes menores (veículos e permissionários)
    if (
      currentValue.length > 20 &&
      currentValue.length < 40 &&
      currentValue[currentValue.length - 1] === '}'
    ) {
      try {
        const parsedData = JSON.parse(currentValue);
        console.log('Dados do QR code parseados:', parsedData);

        if (parsedData.permissionario) {
          setScanResult({ permissionario: parsedData.permissionario });
        } else if (parsedData.licensePlate) {
          setScanResult({ licensePlate: parsedData.licensePlate });
        } else {
          throw new Error('Formato de QR code não reconhecido');
        }
        
        inputRef.current.value = null;
      } catch (error) {
        console.error('Erro ao processar QR code:', error);
        toast({
          title: 'Código QR inválido',
          description: 'Se possível, encaminhar para S2 urgentemente',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        setMessage('Atualize a página para usar o leitor');
        inputRef.current.value = null;
      }
    }

    // QR codes maiores (missões)
    if (currentValue.length > 30 && currentValue[currentValue.length - 1] === '}') {
      try {
        const mission = JSON.parse(currentValue);
        setScanResult(mission);
        inputRef.current.value = null;
      } catch (error) {
        toast({
          title: 'Código QR inválido',
          description: 'Se possível, encaminhar para S2 urgentemente',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        setMessage('Atualize a página para usar o leitor');
        inputRef.current.value = null;
      }
    }
  };

  const toggleScannerMode = () => {
    setScanResult(null);
    setIsProcessing(false);
    setRawQrData(null);
    setUseCameraScanner(!useCameraScanner);

    if (!useCameraScanner) {
      setMessage('Usando câmera do dispositivo');
    } else {
      setMessage('Operando pelo Leitor');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsProcessing(false);
    setRawQrData(null);
  };

  return {
    scanResult,
    setScanResult,
    isProcessing,
    setIsProcessing,
    useCameraScanner,
    rawQrData,
    message,
    inputRef,
    handleScanWebCam,
    handleInputChange,
    toggleScannerMode,
    resetScanner,
  };
};
