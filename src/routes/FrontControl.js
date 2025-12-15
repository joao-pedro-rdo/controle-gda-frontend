import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  Badge,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import Unauthorized from "../components/Unauthorized";
import QRCodeInput from "../components/QRCodeInput";
import PermissionarioPopup from "../components/FrontControl/AddPermissionario";
import LoadingComponent from "../components/FrontControl/LoadingComponent";
import AuthorizedUserModal from "../components/FrontControl/AuthorizedUserModal";
import MissionForm from "../components/FrontControl/MissionForm";
import ScannerModeToggle from "../components/FrontControl/ScannerModeToggle";
import { useEffect } from "react";

// Hooks customizados
import { useQRScanner } from "../hooks/useQRScanner";
import { useFrontControl } from "../hooks/useFrontControl";

const FrontControl = () => {
  const auth = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isAuthorizedModalOpen, 
    onOpen: onAuthorizedModalOpen, 
    onClose: onAuthorizedModalClose 
  } = useDisclosure();

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

  // Abrir modal quando autorizado
  useEffect(() => {
    if (authorized && !mission) {
      onAuthorizedModalOpen();
      
      // Fechar automaticamente após 5 segundos e resetar
      const timer = setTimeout(() => {
        onAuthorizedModalClose();
        resetScanner();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [authorized, mission]);

  const handlePermissionarioSelect = (permissionario) => {
    setScanResult(permissionario);
    onClose();
  };

  const handleCloseAuthorizedModal = () => {
    onAuthorizedModalClose();
    resetScanner();
  };

  if (auth.user.role !== "Guarda") return <Unauthorized />;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-6 md:mt-10 w-full max-w-4xl mx-auto px-4 pb-8">
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
            className="absolute -top-[9999px]"
            onInput={handleInputChange}
          />
        )}

        {/* Scanner de câmera */}
        {useCameraScanner && (
          <div className="w-full max-w-md mx-auto mb-4">
            <QRCodeInput
              onScan={handleScanWebCam}
              showRawData={true}
            />
          </div>
        )}

        {/* Badge de status */}
        <Badge
          mb={8}
          fontSize={{ base: "1rem", md: "1.4rem" }}
          colorScheme={
            message === "Operando pelo Leitor" || message === "Usando câmera do dispositivo"
              ? "green"
              : "red"
          }
          className="px-4 py-2"
        >
          {message}
        </Badge>

        {/* Conteúdo principal */}
        {isLoading ? (
          <LoadingComponent message={loadingMessage} />
        ) : scanResult && !authorized && !mission ? (
          <div className="w-full max-w-2xl">
            <p className="text-xl md:text-2xl text-center font-bold text-red-600 p-5">
              QR Code inválido!
            </p>
            <p className="text-xl md:text-2xl text-center font-bold text-red-600">
              Entrar como visitante e Procurar S2 imediatamente
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center items-center">
              <a href="/visitante">
                <Button colorScheme="teal" size={{ base: "md", md: "lg" }} className="w-40">
                  Visitante
                </Button>
              </a>
              <Button 
                colorScheme="purple" 
                size={{ base: "md", md: "lg" }} 
                className="w-40"
                onClick={onOpen}
              >
                Permissionário
              </Button>
            </div>
          </div>
        ) : mission ? (
          <MissionForm mission={mission} setMission={setMission} />
        ) : (
          <div className="flex flex-col items-center w-full">
            <p className="text-lg md:text-2xl mb-6 text-center px-4">
              Aguardando leitura do QR Code...
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a href="/visitante">
                <Button colorScheme="teal" size={{ base: "md", md: "lg" }} className="w-40">
                  Visitante
                </Button>
              </a>
              <Button 
                colorScheme="purple" 
                size={{ base: "md", md: "lg" }} 
                className="w-40"
                onClick={onOpen}
              >
                Permissionário
              </Button>
            </div>
          </div>
        )}

        {/* Modal de usuário autorizado */}
        <AuthorizedUserModal
          isOpen={isAuthorizedModalOpen}
          onClose={handleCloseAuthorizedModal}
          authorized={authorized}
        />

        {/* Modal de seleção de permissionário */}
        <PermissionarioPopup
          isOpen={isOpen}
          onClose={onClose}
          onSelect={handlePermissionarioSelect}
        />
      </div>
    </>
  );
};

export default FrontControl;
