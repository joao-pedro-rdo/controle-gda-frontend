import { Badge, Flex, Text } from '@chakra-ui/react';
import styled from 'styled-components';
import AuthenticatedImage from '../AuthenticatedImage';

const InfoCard = styled.div`
  margin-top: 0.8rem;
  text-align: center;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 50%;
`;

const AuthorizedUserCard = ({ authorized }) => {
  const isPermissionario = authorized?.isPermissionario || authorized?.type === 'permissionario';

  return (
    <InfoCard>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Text fontSize="6xl" fontWeight="bold" color="green.500" mb={4}>
          ✓ AUTORIZADO
        </Text>

        {isPermissionario ? (
          <>
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
            <Text>Local: {authorized.local || 'Não informado'}</Text>
            {authorized.carModel && (
              <Text>
                Veículo: {authorized.carModel} - {authorized.licensePlate} ({authorized.color})
              </Text>
            )}
            <Text fontSize="lg" color="blue.600" fontWeight="bold" mt={2}>
              PERMISSIONÁRIO
            </Text>
          </>
        ) : (
          <>
            <Text fontSize="2xl" fontWeight="semibold">
              {authorized.tagName}
            </Text>
            <Text>
              Veículo: {authorized.carModel} - {authorized.licensePlate}
            </Text>
            <Text>Cor: {authorized.color}</Text>
            {authorized.company && <Text>Companhia: {authorized.company}</Text>}
            {authorized.section && <Text>Seção: {authorized.section}</Text>}
            <Text fontSize="lg" color="orange.600" fontWeight="bold" mt={2}>
              VEÍCULO DE MILITAR
            </Text>
          </>
        )}

        <Badge colorScheme="green" fontSize="1.2rem" mt={3}>
          Entrada Registrada
        </Badge>
      </Flex>
    </InfoCard>
  );
};

export default AuthorizedUserCard;
