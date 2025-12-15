import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";
import {
  Badge,
  Button,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Unauthorized from "../components/Unauthorized";
import QRCodeInput from "../components/QRCodeInput";
import PermissionarioPopup from "../components/FrontControl/AddPermissionario";
import LoadingComponent from "../components/FrontControl/LoadingComponent";
import AuthorizedUserCard from "../components/FrontControl/AuthorizedUserCard";
import MissionForm from "../components/FrontControl/MissionForm";
import ScannerModeToggle from "../components/FrontControl/ScannerModeToggle";

// Hooks customizados
import { useQRScanner } from "../hooks/useQRScanner";
import { useFrontControl } from "../hooks/useFrontControl";

const FrontControl = () => {
  const auth = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Hook para gerenciar o scanner
  const {
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
  } = useQRScanner();

  // Hook para gerenciar a lógica de controle
  const {
    authorized,
    mission,
    setMission,
    isLoading,
    loadingMessage,
    hasApiResponse,
  } = useFrontControl(scanResult, setIsProcessing);

  const handlePermissionarioSelect = (permissionario) => {
    setScanResult(permissionario);
    onClose();
  };

  const handleResetAfterEntry = () => {
    setTimeout(() => {
      resetScanner();
    }, 5000);
  };

  if (auth.user.role !== "Guarda") return <Unauthorized />;

  return (
    <>
      <Navbar />
      <Wrapper>
        {/* Toggle entre câmera e leitor físico */}
        <ScannerModeToggle
          useCameraScanner={useCameraScanner}
          onToggle={toggleScannerMode}
        />

        {/* Input invisível para leitor físico */}
        {!useCameraScanner && (
          <input
            type="text"
            ref={inputRef}
            style={{ position: "absolute", top: "-9999px" }}
            onInput={handleInputChange}
          />
        )}

        {/* Scanner de câmera */}
        {useCameraScanner && (
          <CamBox>
            <QRCodeInput
              onScan={handleScanWebCam}
              showRawData={true}
            />
          </CamBox>
        )}

        {/* Badge de status */}
        <Badge
          mb={8}
          fontSize="1.4rem"
          colorScheme={
            message === "Operando pelo Leitor" || message === "Usando câmera do dispositivo"
              ? "green"
              : "red"
          }
        >
          {message}
        </Badge>

        {/* Conteúdo principal */}
        {isLoading ? (
          <LoadingComponent message={loadingMessage} />
        ) : scanResult ? (
          <>
            {mission ? (
              <MissionForm mission={mission} setMission={setMission} />
            ) : authorized ? (
              <AuthorizedUserCard authorized={authorized} />
            ) : (
              <>
                <Text p={5} fontSize={26} textAlign="center" fontWeight={700} color="#ff0000">
                  QR Code inválido!
                </Text>
                <Text fontSize={26} textAlign="center" fontWeight={700} color="#ff0000">
                  Entrar como visitante e Procurar S2 imediatamente
                </Text>

                <Flex gap={4} mt={4}>
                  <a href="/visitante">
                    <Button colorScheme="teal" p="2rem" w="150px">
                      Visitante
                    </Button>
                  </a>
                  <Button colorScheme="purple" p="2rem" w="150px" onClick={onOpen}>
                    Permissionário
                  </Button>
                </Flex>
              </>
            )}
          </>
        ) : (
          <>
            <Text fontSize="1.5rem" mb={4}>
              Aguardando leitura do QR Code...
            </Text>

            <Flex gap={4} direction={{ base: "column", md: "row" }} align="center">
              <a href="/visitante">
                <Button colorScheme="teal" p="2rem" w="150px" size="lg">
                  Visitante
                </Button>
              </a>
              <Button colorScheme="purple" p="2rem" w="150px" size="lg" onClick={onOpen}>
                Permissionário
              </Button>
            </Flex>
          </>
        )}

        {/* Modal de seleção de permissionário */}
        <PermissionarioPopup
          isOpen={isOpen}
          onClose={onClose}
          onSelect={handlePermissionarioSelect}
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

const CamBox = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

export default FrontControl;
