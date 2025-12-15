import { Badge } from '@chakra-ui/react';
import AuthenticatedImage from '../AuthenticatedImage';

const AuthorizedUserCard = ({ authorized }) => {
  const isPermissionario = authorized?.isPermissionario || authorized?.type === 'permissionario';

  return (
    <div className="mt-3 text-center border border-gray-300 p-4 md:p-6 rounded-lg w-full max-w-md md:max-w-lg mx-auto bg-white shadow-sm">
      <div className="flex flex-col items-center justify-center">
        <p className="text-4xl md:text-6xl font-bold text-green-500 mb-4">
          ✓ AUTORIZADO
        </p>

        {isPermissionario ? (
          <>
            {authorized.imagePath && (
              <AuthenticatedImage
                imagePath={authorized.imagePath}
                alt={authorized.completeName}
                boxSize={{ base: "120px", md: "150px" }}
                objectFit="cover"
                borderRadius="full"
                mx="auto"
                my={3}
                border="3px solid"
                borderColor="green.300"
              />
            )}
            <p className="text-xl md:text-2xl font-semibold mb-2">
              {authorized.completeName}
            </p>
            <p className="text-sm md:text-base text-gray-700 mb-1">
              CPF: {authorized.CPF}
            </p>
            <p className="text-sm md:text-base text-gray-700 mb-1">
              Local: {authorized.local || 'Não informado'}
            </p>
            {authorized.carModel && (
              <p className="text-sm md:text-base text-gray-700 mb-1">
                Veículo: {authorized.carModel} - {authorized.licensePlate} ({authorized.color})
              </p>
            )}
            <p className="text-base md:text-lg text-blue-600 font-bold mt-2">
              PERMISSIONÁRIO
            </p>
          </>
        ) : (
          <>
            <p className="text-xl md:text-2xl font-semibold mb-2">
              {authorized.tagName}
            </p>
            <p className="text-sm md:text-base text-gray-700 mb-1">
              Veículo: {authorized.carModel} - {authorized.licensePlate}
            </p>
            <p className="text-sm md:text-base text-gray-700 mb-1">
              Cor: {authorized.color}
            </p>
            {authorized.company && (
              <p className="text-sm md:text-base text-gray-700 mb-1">
                Companhia: {authorized.company}
              </p>
            )}
            {authorized.section && (
              <p className="text-sm md:text-base text-gray-700 mb-1">
                Seção: {authorized.section}
              </p>
            )}
            <p className="text-base md:text-lg text-orange-600 font-bold mt-2">
              VEÍCULO DE MILITAR
            </p>
          </>
        )}

        <Badge colorScheme="green" fontSize={{ base: "1rem", md: "1.2rem" }} mt={3} className="px-3 py-1">
          Entrada Registrada
        </Badge>
      </div>
    </div>
  );
};

export default AuthorizedUserCard;
