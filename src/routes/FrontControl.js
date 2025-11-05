import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Badge,
  Box,
  Button,
  Flex,
  FormLabel,
  Image,
  Input,
  Text,
  useToast,
  Switch,
  FormControl,
  FormHelperText,
  VStack,
  CircularProgress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure, // ← ADICIONAR ESTA IMPORTAÇÃO
} from "@chakra-ui/react";
import client from "../services/client";
import { useForm } from "react-hook-form";
import Unauthorized from "../components/Unauthorized";

// Imports para uso com celular
import QRCodeInput from "../components/QRCodeInput";
import AuthenticatedImage from "../components/AuthenticatedImage";

// ✅ IMPORTAR O COMPONENTE CRIADO
import PermissionarioPopup from "../components/FrontControl/AddPermissionario";

//const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const FrontControl = () => {
  const auth = useAuth();
  const [scanResultWebCam, setScanResultWebCam] = useState(null);
  const [authorized, setAuthorized] = useState(null); // Deve conter os dados completos do usuário/veículo/permissionário autorizado
  const [message, setMessage] = useState("Operando pelo Leitor");
  const { register, handleSubmit, reset } = useForm();
  const [mission, setMission] = useState();
  const toast = useToast();
  const inputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useCameraScanner, setUseCameraScanner] = useState(false);
  const [rawQrData, setRawQrData] = useState(null); // Adicionado para armazenar dados brutos do QR Code

  // Novos estados para controle de loading
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [hasApiResponse, setHasApiResponse] = useState(false);

  useEffect(() => {
    if (!useCameraScanner && inputRef.current) {
      inputRef.current.focus();
      const handleBlur = () => {
        setTimeout(() => {
          setMessage("Atualize a página para operar pelo Leitor");
        }, 5000);
      };

      // Adiciona o event listener para o evento "blur" ao input
      inputRef.current.addEventListener("blur", handleBlur);

      // Remove o event listener quando o componente é desmontado para evitar vazamentos de memória
      return () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener("blur", handleBlur);
        }
      };
    }
  }, [useCameraScanner]);

  const submitMission = async (data) => {
    try {
      if (!mission?.initialOdometer) {
        const { initialOdometer, chefeVtr } = data;
        await client.patch(`/initialOdometer/${mission.id}`, {
          initialOdometer,
          chefeVtr,
        });
      } else {
        const { finalOdometer } = data;
        await client.patch(`/finalOdometer/${mission.id}`, {
          finalOdometer,
        });
      }
      reset();
      setMission(null);
      setScanResultWebCam(null);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // PARA USO COM CELULAR - Atualizado para a nova biblioteca
  const handleErrorWebCam = (error) => {
    // Ignorar erros comuns que são apenas mensagens de diagnóstico
    if (
      error?.message?.includes("MultiFormat Readers") ||
      error?.message?.includes("QR code parse error")
    ) {
      return;
    }

    //! CAUSA UM BUG E FICA ESPAMANDO NA TELA ERRO DE CAMERA MAS ELA ESTA FUNCIONANDO
    // console.log("Erro crítico na câmera:", error);
    // toast({
    //   title: "Erro na câmera",
    //   description: "Verifique se você permitiu o acesso à câmera",
    //   status: "error",
    //   duration: 5000,
    //   isClosable: true,
    // });
  };

  // Adaptado para a nova biblioteca
  const handleScanWebCam = (result, rawText) => {
    // Armazena o texto bruto para depuração
    setRawQrData(rawText);

    console.log("QR code lido via câmera:", result);

    if (result && !isProcessing) {
      setIsProcessing(true);
      setScanResultWebCam(result);
    }
  };

  useEffect(() => {
    console.log("Processando scanResultWebCam:", scanResultWebCam);

    // Resetar estados quando há nova leitura
    if (scanResultWebCam) {
      setHasApiResponse(false);
      setAuthorized(null);
    }

    // Caso 1: QR code de permissionário
    if (
      scanResultWebCam?.permissionario &&
      typeof scanResultWebCam.permissionario === "string"
    ) {
      console.log(
        "QR de permissionário detectado, buscando por CPF:",
        scanResultWebCam.permissionario
      );

      // INICIAR LOADING
      setIsLoading(true);
      setLoadingMessage("Validando permissionário...");

      const request = async () => {
        try {
          // Simular delay para teste (remover em produção)
          // await new Promise(resolve => setTimeout(resolve, 2000));

          const response = await client.get(
            `/permissionarioByCPF/${scanResultWebCam.permissionario}`
          );
          console.log("Resposta da API para permissionário:", response.data);

          if (response.data?.completeName) {
            const permissionarioData = {
              ...response.data,
              isPermissionario: true,
              type: "permissionario",
            };
            setAuthorized(permissionarioData);
            setScanResultWebCam(permissionarioData);
            setHasApiResponse(true);

            if (!isProcessing) {
              setIsProcessing(true);
            }
            handlePermissionarioEntry(permissionarioData);
          }
        } catch (error) {
          console.error("Erro ao buscar permissionário:", error);
          setHasApiResponse(true);
          setAuthorized(null);

          toast({
            title: "Permissionário não encontrado",
            description:
              "O permissionário com este CPF não está registrado no sistema",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setIsProcessing(false);
        } finally {
          // PARAR LOADING
          setIsLoading(false);
          setLoadingMessage("");
        }
      };
      request();
    }
    // Caso 2: QR code de veículo
    else if (
      scanResultWebCam?.licensePlate &&
      typeof scanResultWebCam.licensePlate === "string" &&
      !scanResultWebCam?.permissionario &&
      !scanResultWebCam.CPF
    ) {
      console.log(
        "QR de veículo detectado, buscando por placa:",
        scanResultWebCam.licensePlate
      );

      // INICIAR LOADING
      setIsLoading(true);
      setLoadingMessage("Validando veículo...");

      const request = async () => {
        try {
          // Simular delay para teste (remover em produção)
          // await new Promise(resolve => setTimeout(resolve, 2000));

          const response = await client.get(
            `/vehiclebyplate/${scanResultWebCam.licensePlate}`
          );
          console.log("Resposta da API para veículo:", response.data);

          if (response.data?.tagName) {
            const vehicleData = {
              ...response.data,
              isPermissionario: false,
              type: "veiculo",
            };
            setAuthorized(vehicleData);
            setHasApiResponse(true);

            if (!isProcessing) {
              setIsProcessing(true);
            }
            handleEntry(vehicleData);
          }
        } catch (error) {
          console.error("Erro ao buscar veículo:", error);
          setHasApiResponse(true);
          setAuthorized(null);

          toast({
            title: "Veículo não encontrado",
            description:
              "O veículo com esta placa não está registrado no sistema",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setIsProcessing(false);
        } finally {
          // PARAR LOADING
          setIsLoading(false);
          setLoadingMessage("");
        }
      };
      request();
    } else if (scanResultWebCam?.mission) {
      // Caso 3: QR Code de missão
      setIsLoading(true);
      setLoadingMessage("Carregando missão...");

      const request = async () => {
        try {
          // Simular delay para teste (remover em produção)
          // await new Promise(resolve => setTimeout(resolve, 2000));

          const response = await client.get(
            `/missions/${scanResultWebCam.mission}`
          );
          console.log("Resposta da API para missão:", response.data);
          setMission(response.data);
          setHasApiResponse(true);

          if (response.data.initialOdometer && response.data.finalOdometer)
            setMessage("Atualize a página para operar pelo leitor");
        } catch (error) {
          console.error("Erro ao buscar missão:", error);
          setHasApiResponse(true);
        } finally {
          setIsLoading(false);
          setLoadingMessage("");
        }
      };
      request();
    } else if (scanResultWebCam?.tagName) {
      // Caso 4: Objeto de veículo completo
      setIsLoading(true);
      setLoadingMessage("Validando dados do veículo...");

      const request = async () => {
        try {
          // Simular delay para teste (remover em produção)
          // await new Promise(resolve => setTimeout(resolve, 2000));

          const response = await client.get(`/vehicles/${scanResultWebCam.id}`);
          if (response.data.tagName) {
            setAuthorized(response.data);
            setHasApiResponse(true);

            if (!isProcessing) {
              setIsProcessing(true);
              handleEntry(response.data);
            }
          }
        } catch (error) {
          console.error("Erro ao validar veículo:", error);
          setHasApiResponse(true);
          setAuthorized(null);
        } finally {
          setIsLoading(false);
          setLoadingMessage("");
        }
      };
      request();
    } else if (scanResultWebCam?.isPermissionario) {
      // Caso 5: Objeto de permissionário completo
      setIsLoading(true);
      setLoadingMessage("Validando permissionário...");

      const request = async () => {
        try {
          // Simular delay para teste (remover em produção)
          // await new Promise(resolve => setTimeout(resolve, 2000));

          const response = await client.get(
            `/permissionarioByCPF/${scanResultWebCam.CPF}`
          );
          if (response.data.completeName) {
            setAuthorized(response.data);
            setHasApiResponse(true);

            if (!isProcessing) {
              setIsProcessing(true);
              handlePermissionarioEntry(response.data);
            }
          }
        } catch (error) {
          console.error("Erro ao validar permissionário:", error);
          setHasApiResponse(true);
          setAuthorized(null);
        } finally {
          setIsLoading(false);
          setLoadingMessage("");
        }
      };
      request();
    } else if (scanResultWebCam) {
      // Caso 6: QR lido mas formato não reconhecido
      console.warn("Formato de QR code não reconhecido:", scanResultWebCam);
      setHasApiResponse(true);
      setAuthorized(null);

      toast({
        title: "Formato de QR code não reconhecido",
        description: "O QR code lido não está em um formato válido",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsProcessing(false);
    }
  }, [scanResultWebCam]);

  // Função simplificada para registrar entrada
  const handleEntry = async (scanedUser) => {
    try {
      const identifier = scanedUser.licensePlate;

      // Verificar se já foi registrado recentemente
      if (checkRecentEntry(identifier)) {
        toast({
          title: "Entrada já registrada",
          description: "Aguarde 45 segundos antes de escanear novamente",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });

        setTimeout(() => {
          setScanResultWebCam(null);
          setAuthorized(null);
          setIsProcessing(false);
        }, 5000);
        return;
      }

      console.log("🔍 Dados do usuário escaneado:", scanedUser);

      const submitData = new FormData();

      // Adicionar campos obrigatórios para veículos
      submitData.append("name", scanedUser.tagName || "");
      submitData.append("type", "Entrada");
      submitData.append("isVisitor", "false");
      submitData.append("isPermissionario", "false"); // Explicitamente falso para veículos
      submitData.append("idNumber", scanedUser.idNumber || "");
      submitData.append("licensePlate", scanedUser.licensePlate || "");
      submitData.append("carModel", scanedUser.carModel || "");
      submitData.append("color", scanedUser.color || "");

      // Campos adicionais que podem ser necessários
      submitData.append("phoneNumber", ""); // Campo vazio para veículos
      submitData.append("contactPerson", ""); // Campo vazio para veículos
      submitData.append(
        "target",
        scanedUser.section || scanedUser.company || ""
      );

      // Log para debug
      console.log("📤 Dados sendo enviados para entrada de veículo:");
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await client.post("/entries", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Resposta do servidor:", response.data);

      toast({
        title: "Entrada Registrada",
        description: `${scanedUser.tagName} - ${scanedUser.licensePlate}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        setScanResultWebCam(null);
        setAuthorized(null);
        setIsProcessing(false);
      }, 5000);
    } catch (error) {
      console.error("❌ Erro ao registrar entrada:", error);
      console.error("❌ Detalhes do erro:", error.response?.data);

      toast({
        title: "Erro ao registrar entrada",
        description: error.response?.data?.message || "Tente novamente",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        setScanResultWebCam(null);
        setAuthorized(null);
        setIsProcessing(false);
      }, 2000);
    }
  };

  // 🕒 CONTROLE DE INTERVALO DE 45 SEGUNDOS
  const [recentEntries, setRecentEntries] = useState(new Map());

  const checkRecentEntry = (identifier) => {
    const now = Date.now();
    const lastEntry = recentEntries.get(identifier);

    if (lastEntry && now - lastEntry < 45000) {
      // 45 segundos
      console.log("⚠️ Entrada recente detectada para:", identifier);
      return true;
    }

    // Atualizar timestamp
    setRecentEntries((prev) => new Map(prev.set(identifier, now)));

    // Limpar entradas antigas (mais de 1 minuto)
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

  // Função para registrar entrada de permissionários - CORRIGIDA
  const handlePermissionarioEntry = async (permissionario) => {
    try {
      const identifier = permissionario.CPF;

      // Verificar se já foi registrado recentemente
      if (checkRecentEntry(identifier)) {
        toast({
          title: "Entrada já registrada",
          description: "Aguarde 45 segundos antes de escanear novamente",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });

        setTimeout(() => {
          setScanResultWebCam(null);
          setAuthorized(null);
          setIsProcessing(false);
        }, 2000);
        return;
      }

      console.log("🔍 Dados do permissionário:", permissionario);

      const submitData = new FormData();

      // Adicionar campos do permissionário
      submitData.append("name", permissionario.completeName || "");
      submitData.append("type", "Entrada");
      submitData.append("isVisitor", "false");
      submitData.append("isPermissionario", "true"); // Explicitamente verdadeiro para permissionários
      submitData.append("idNumber", permissionario.idNumber || "");
      submitData.append("CPF", permissionario.CPF || "");
      submitData.append("licensePlate", permissionario.licensePlate || "N/A");
      submitData.append("carModel", permissionario.carModel || "N/A");
      submitData.append("color", permissionario.color || "N/A");

      // Campos adicionais
      submitData.append("phoneNumber", permissionario.phoneNumber || "");
      submitData.append("contactPerson", ""); // Permissionário não precisa de pessoa de contato
      submitData.append("target", permissionario.local || "");

      // Log para debug
      console.log("📤 Dados sendo enviados para entrada de permissionário:");
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await client.post("/entries", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Resposta do servidor:", response.data);

      toast({
        title: "Entrada Registrada",
        description: `${permissionario.completeName} - Permissionário`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        setScanResultWebCam(null);
        setAuthorized(null);
        setIsProcessing(false);
      }, 5000);
    } catch (error) {
      console.error("❌ Erro ao registrar entrada de permissionário:", error);
      console.error("❌ Detalhes do erro:", error.response?.data);

      toast({
        title: "Erro ao registrar entrada",
        description: error.response?.data?.message || "Tente novamente",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        setScanResultWebCam(null);
        setAuthorized(null);
        setIsProcessing(false);
      }, 2000);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Função para marcar entrada do permissionário selecionado
  const handleAddPermissionario = (permissionario) => {
    console.log("🎯 Permissionário selecionado:", permissionario);
    handlePermissionarioEntry(permissionario);
    onClose();
  };

  if (auth.user.role !== "Guarda") return <Unauthorized />;

  // PARA USO COM LEITOR DE QR CODE
  const handleInputChange = async () => {
    const currentValue = inputRef.current.value;
    console.log("Entrada do leitor físico:", currentValue);

    // Verificação de nível de bateria
    if (currentValue.length == 3 && currentValue[0] >= 0) {
      toast({
        title: `${currentValue} de Bateria`,
        status: "info",
        duration: 9000,
        isClosable: true,
      });
      inputRef.current.value = null;
      return;
    }

    // Verificação para QR codes menores (veículos e permissionários)
    if (
      currentValue.length > 20 &&
      currentValue.length < 40 &&
      currentValue[currentValue.length - 1] === "}"
    ) {
      try {
        const parsedData = JSON.parse(currentValue);
        console.log("Dados do QR code parseados:", parsedData);

        // CORREÇÃO: Para permissionário, definir apenas o campo permissionario
        if (parsedData.permissionario) {
          console.log(
            "QR de permissionário detectado:",
            parsedData.permissionario
          );
          // Passar apenas o objeto com o campo permissionario para que o useEffect processe corretamente
          setScanResultWebCam({
            permissionario: parsedData.permissionario,
          });
          inputRef.current.value = null;
          return;
        }

        // Para veículo, definir apenas o campo licensePlate
        if (parsedData.licensePlate) {
          console.log("QR de veículo detectado:", parsedData.licensePlate);
          // Passar apenas o objeto com o campo licensePlate para que o useEffect processe corretamente
          setScanResultWebCam({
            licensePlate: parsedData.licensePlate,
          });
          inputRef.current.value = null;
          return;
        }

        // Formato de QR code não reconhecido
        console.warn("Formato de QR code não reconhecido:", parsedData);
        throw new Error("Formato de QR code não reconhecido");
      } catch (error) {
        console.error("Erro ao processar QR code:", error);
        toast({
          title: "Código QR inválido",
          description: "Se possível, encaminhar para S2 urgentemente",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setMessage("Atualize a página para usar o leitor");
        inputRef.current.value = null;
      }
    }

    // Verificação para QR codes maiores (missões)
    if (
      currentValue.length > 30 &&
      currentValue[currentValue.length - 1] === "}"
    ) {
      try {
        const mission = JSON.parse(currentValue);
        console.log("QR de missão detectado:", mission);
        setScanResultWebCam(mission);
        inputRef.current.value = null;
      } catch (error) {
        console.error("Erro ao processar QR code de missão:", error);
        toast({
          title: "Código QR inválido",
          description: "Se possível, encaminhar para S2 urgentemente",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setMessage("Atualize a página para usar o leitor");
        inputRef.current.value = null;
      }
    }
  };

  // Alternar entre câmera e leitor físico - Atualizado
  const toggleScannerMode = () => {
    setScanResultWebCam(null);
    setAuthorized(null);
    setIsProcessing(false);
    setRawQrData(null);

    // NOVO: Resetar estados de loading
    setIsLoading(false);
    setLoadingMessage("");
    setHasApiResponse(false);

    setUseCameraScanner(!useCameraScanner);

    if (!useCameraScanner) {
      setMessage("Usando câmera do dispositivo");
    } else {
      setMessage("Operando pelo Leitor");
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  };

  // Função para limpar os dados brutos do QR Code
  const clearRawData = () => {
    setRawQrData(null);
  };

  // Função para identificar o tipo de usuário - CORRIGIDA
  const identifyUserType = () => {
    // Usar 'authorized' que contém os dados completos após validação
    const userData = authorized || scanResultWebCam;

    // Verificar de forma clara se é um permissionário
    if (
      userData?.isPermissionario === true ||
      (userData?.CPF && userData?.completeName) ||
      userData?.type === "permissionario" // Verifica o tipo explicitamente
    ) {
      console.log("Identificado como PERMISSIONÁRIO:", userData);
      return "permissionario";
    }

    // Verificar de forma clara se é um veículo
    if (
      userData?.tagName ||
      userData?.type === "veiculo" // Verifica o tipo explicitamente
    ) {
      console.log("Identificado como VEÍCULO:", userData);
      return "veiculo";
    }
    if (userData?.mission) {
      return "mission";
    }
    return null;
  };

  // Componente de Loading
  const LoadingComponent = () => (
    <Flex direction="column" align="center" justify="center" py={8}>
      <Box position="relative" mb={4}>
        <CircularProgress
          isIndeterminate
          color="blue.400"
          size="80px"
          thickness="4px"
        />
      </Box>
      <Text fontSize="xl" fontWeight="semibold" color="blue.600">
        {loadingMessage || "Verificando autorização..."}
      </Text>
      <Text fontSize="sm" color="gray.500" mt={2}>
        Aguarde, processando dados do QR Code...
      </Text>
    </Flex>
  );

  const handleSelectPermissionario = (permissionario) => {
    setAuthorized(permissionario);
    setScanResultWebCam(permissionario);
    onClose();
  };

  return (
    <>
      <Navbar />
      <Wrapper>
        {/* Opção para alternar entre câmera e leitor físico */}
        <FormControl
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={4}
        >
          <FormHelperText mr={2}>Leitor Físico</FormHelperText>
          <Switch
            id="scanner-mode"
            isChecked={useCameraScanner}
            onChange={toggleScannerMode}
            colorScheme="green"
          />
          <FormHelperText ml={2}>Câmera</FormHelperText>
        </FormControl>

        {/* Input para leitor QR Code físico */}
        {!useCameraScanner && (
          <input
            type="text"
            ref={inputRef}
            style={{ position: "absolute", top: "-9999px" }}
            onInput={handleInputChange}
          />
        )}

        {/* Componente de câmera para leitura de QR Code */}
        {useCameraScanner && (
          <CamBox>
            <QRCodeInput
              onScan={handleScanWebCam}
              onError={handleErrorWebCam}
              showRawData={true}
            />

            {/* Painel de Depuração QR */}
            {rawQrData && (
              <Box
                mt={4}
                p={3}
                border="1px solid #ccc"
                borderRadius="md"
                bg="gray.50"
                maxW="100%"
                overflow="auto"
              >
                <Box
                  p={2}
                  bg="black"
                  color="green.300"
                  fontFamily="monospace"
                  fontSize="sm"
                  borderRadius="md"
                  maxHeight="150px"
                  overflow="auto"
                  whiteSpace="pre-wrap"
                  wordBreak="break-all"
                >
                  {rawQrData}
                </Box>
              </Box>
            )}
          </CamBox>
        )}

        {/* Badge de status */}
        {message === "Operando pelo Leitor" ||
        message === "Usando câmera do dispositivo" ? (
          <Badge mb={8} fontSize="1.4rem" colorScheme="green">
            {message}
          </Badge>
        ) : (
          <Badge mb={8} fontSize="1.4rem" colorScheme="red">
            {message}
          </Badge>
        )}

        {/* NOVO: Mostrar loading quando isLoading for true */}
        {isLoading ? (
          <LoadingComponent />
        ) : scanResultWebCam ? (
          <>
            {mission ? (
              // Conteúdo do formulário de missão...
              mission?.initialOdometer && mission?.finalOdometer ? (
                <Text fontWeight={700} mt={12} fontSize={35} color={"red"}>
                  FICHA INVÁLIDA!
                </Text>
              ) : (
                <Box
                  w="60%"
                  border={"1px solid #ccc"}
                  borderRadius="1rem"
                  p={5}
                  mt={5}
                >
                  {/* Formulário de missão sem alteração */}
                  <form onSubmit={handleSubmit(submitMission)}>
                    <Flex flexDir={"column"} gap={5}>
                      <Text fontSize={"1.5rem"}>
                        <strong>Motorista: </strong>
                        {mission.driver.name}
                      </Text>
                      <Text fontSize={"1.5rem"}>
                        <strong>Missão: </strong>
                        {mission.complements}
                      </Text>
                    </Flex>

                    <Flex justifyContent={"space-between"} w={"100%"}>
                      {!mission?.initialOdometer && (
                        <Flex w={"100%"}>
                          <FormLabel w={"100%"} mt={6} fontSize={"1.1rem"}>
                            <strong>Chefe de viatura: </strong>{" "}
                            <Input
                              w={"70%"}
                              type={"text"}
                              {...register("chefeVtr")}
                            />
                          </FormLabel>
                        </Flex>
                      )}

                      <Text mt={6} fontSize={"1.1rem"}>
                        <strong>Hodômetro:</strong>{" "}
                        <Input
                          w={"50%"}
                          type={"number"}
                          {...register(
                            mission?.initialOdometer
                              ? "finalOdometer"
                              : "initialOdometer"
                          )}
                        />
                      </Text>
                    </Flex>
                    <Button
                      w="100%"
                      mt={5}
                      type="submit"
                      colorScheme={mission?.initialOdometer ? "red" : "green"}
                    >
                      {mission?.initialOdometer
                        ? "Fechar ficha"
                        : "Abrir ficha"}
                    </Button>
                  </form>
                </Box>
              )
            ) : authorized ? (
              <>
                <InfoCard>
                  {/* Conteúdo da exibição do usuário autorizado... */}
                  {(() => {
                    const userType = identifyUserType();
                    console.log("Tipo de usuário para exibição:", userType);

                    if (userType === "permissionario") {
                      return (
                        <Flex
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text
                            fontSize="6xl"
                            fontWeight="bold"
                            color="green.500"
                            mb={4}
                          >
                            ✓ AUTORIZADO
                          </Text>
                          {authorized.imagePath && (
                            <AuthenticatedImage
                              imagePath={authorized.imagePath}
                              alt={authorized.completeName}
                              boxSize="150px"
                              objectFit="cover"
                              borderRadius="full"
                              mx="auto"
                              my={3}
                              border="3px solid"
                              borderColor="green.300"
                            />
                          )}
                          <Text fontSize="2xl" fontWeight="semibold">
                            {authorized.completeName}
                          </Text>
                          <Text>CPF: {authorized.CPF}</Text>
                          <Text>
                            Local: {authorized.local || "Não informado"}
                          </Text>
                          {authorized.carModel && (
                            <Text>
                              Veículo: {authorized.carModel} -{" "}
                              {authorized.licensePlate} ({authorized.color})
                            </Text>
                          )}
                          <Text
                            fontSize="lg"
                            color="blue.600"
                            fontWeight="bold"
                            mt={2}
                          >
                            PERMISSIONÁRIO
                          </Text>
                        </Flex>
                      );
                    } else {
                      return (
                        <Flex
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text
                            fontSize="6xl"
                            fontWeight="bold"
                            color="green.500"
                            mb={4}
                          >
                            ✓ AUTORIZADO
                          </Text>
                          <Text fontSize="2xl" fontWeight="semibold">
                            {authorized.tagName}
                          </Text>
                          <Text>
                            Veículo: {authorized.carModel} -{" "}
                            {authorized.licensePlate}
                          </Text>
                          <Text>Cor: {authorized.color}</Text>
                          {authorized.company && (
                            <Text>Companhia: {authorized.company}</Text>
                          )}
                          {authorized.section && (
                            <Text>Seção: {authorized.section}</Text>
                          )}
                          <Text
                            fontSize="lg"
                            color="orange.600"
                            fontWeight="bold"
                            mt={2}
                          >
                            VEÍCULO DE MILITAR
                          </Text>
                        </Flex>
                      );
                    }
                  })()}

                  <Badge colorScheme="green" fontSize="1.2rem" mt={3}>
                    Entrada Registrada
                  </Badge>
                </InfoCard>
              </>
            ) : (
              <>
                <Text
                  p={5}
                  fontSize={26}
                  textAlign="center"
                  fontWeight={700}
                  color={"#ff0000"}
                >
                  QR Code inválido!{" "}
                </Text>
                <Text
                  fontSize={26}
                  textAlign="center"
                  fontWeight={700}
                  color={"#ff0000"}
                >
                  Entrar como visitante e Procurar S2 imediatamente
                </Text>

                {/* 🎯 BOTÕES SEMPRE VISÍVEIS EM CASO DE ERRO */}
                <Flex gap={4} mt={4}>
                  <a href="/visitante">
                    <Button colorScheme="teal" p="2rem" w="150px">
                      Visitante
                    </Button>
                  </a>
                  <Button
                    colorScheme="purple"
                    p="2rem"
                    w="150px"
                    onClick={onOpen}
                  >
                    Permissionário
                  </Button>
                </Flex>
              </>
            )}
          </>
        ) : (
          <>
            {/* 🎯 TELA INICIAL - BOTÕES SEMPRE VISÍVEIS */}
            <Text fontSize="1.5rem" mb={4}>
              Aguardando leitura do QR Code...
            </Text>

            <Flex
              gap={4}
              direction={{ base: "column", md: "row" }}
              align="center"
            >
              <a href="/visitante">
                <Button colorScheme="teal" p="2rem" w="150px" size="lg">
                  Visitante
                </Button>
              </a>
              <Button
                colorScheme="purple"
                p="2rem"
                w="150px"
                size="lg"
                onClick={onOpen}
              >
                Permissionário
              </Button>
            </Flex>
          </>
        )}

        {/* Modal de seleção de permissionário */}
        <PermissionarioPopup
          isOpen={isOpen}
          onClose={onClose}
          onSelect={handleAddPermissionario}
        />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 40px;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 16px;
`;

const InfoCard = styled.div`
  margin-top: 0.8rem;
  text-align: center;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 50%;
`;

const CamBox = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

export default FrontControl;
