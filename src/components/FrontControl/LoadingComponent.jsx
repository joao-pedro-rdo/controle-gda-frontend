import { Box, CircularProgress, Flex, Text } from '@chakra-ui/react';

const LoadingComponent = ({ message }) => (
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
      {message || 'Verificando autorização...'}
    </Text>
    <Text fontSize="sm" color="gray.500" mt={2}>
      Aguarde, processando dados do QR Code...
    </Text>
  </Flex>
);

export default LoadingComponent;
