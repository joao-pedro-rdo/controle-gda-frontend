import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Badge,
} from '@chakra-ui/react';
import AuthenticatedImage from '../AuthenticatedImage';

const AuthorizedUserModal = ({ isOpen, onClose, authorized }) => {
  if (!authorized) return null;

  const isPermissionario = authorized?.isPermissionario || authorized?.type === 'permissionario';

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: "full", md: "xl" }}>
      <ModalOverlay 
        bg="blackAlpha.700" 
        backdropFilter="blur(10px)"
      />
      <ModalContent 
        className="mx-4 my-auto"
        borderRadius={{ base: "0", md: "2xl" }}
        overflow="hidden"
      >
        <ModalHeader 
          className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-6"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-6xl md:text-7xl">✓</div>
            <h2 className="text-2xl md:text-3xl font-bold">AUTORIZADO</h2>
          </div>
        </ModalHeader>
        
        <ModalCloseButton 
          className="text-white hover:bg-white/20 rounded-full"
          size="lg"
          top={4}
          right={4}
        />

        <ModalBody className="p-6 md:p-8">
          <div className="flex flex-col items-center gap-4">
            {isPermissionario ? (
              <>
                {authorized.imagePath && (
                  <div className="mb-4">
                    <AuthenticatedImage
                      imagePath={authorized.imagePath}
                      alt={authorized.completeName}
                      boxSize={{ base: "140px", md: "180px" }}
                      objectFit="cover"
                      borderRadius="full"
                      border="4px solid"
                      borderColor="green.400"
                      className="shadow-xl"
                    />
                  </div>
                )}
                
                <div className="w-full space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Nome Completo</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                      {authorized.completeName}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">CPF</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {authorized.CPF}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Local</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {authorized.local || 'Não informado'}
                    </p>
                  </div>

                  {authorized.carModel && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Veículo</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {authorized.carModel} - {authorized.licensePlate}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Cor: {authorized.color}
                      </p>
                    </div>
                  )}
                </div>

                <Badge 
                  colorScheme="blue" 
                  fontSize={{ base: "md", md: "lg" }}
                  className="px-6 py-2 rounded-full mt-4"
                >
                  PERMISSIONÁRIO
                </Badge>
              </>
            ) : (
              <>
                <div className="w-full space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Nome</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                      {authorized.tagName}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Veículo</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {authorized.carModel} - {authorized.licensePlate}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Cor: {authorized.color}
                    </p>
                  </div>

                  {authorized.company && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Companhia</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {authorized.company}
                      </p>
                    </div>
                  )}

                  {authorized.section && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Seção</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {authorized.section}
                      </p>
                    </div>
                  )}
                </div>

                <Badge 
                  colorScheme="orange" 
                  fontSize={{ base: "md", md: "lg" }}
                  className="px-6 py-2 rounded-full mt-4"
                >
                  VEÍCULO DE MILITAR
                </Badge>
              </>
            )}

            <div className="w-full mt-6">
              <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 text-center">
                <Badge 
                  colorScheme="green" 
                  fontSize={{ base: "lg", md: "xl" }}
                  className="px-6 py-2"
                >
                  ✓ Entrada Registrada
                </Badge>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthorizedUserModal;
