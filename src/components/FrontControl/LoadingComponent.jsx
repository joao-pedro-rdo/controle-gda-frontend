import { CircularProgress } from '@chakra-ui/react';

const LoadingComponent = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-8 px-4">
    <div className="relative mb-4">
      <CircularProgress
        isIndeterminate
        color="blue.400"
        size="80px"
        thickness="4px"
      />
    </div>
    <p className="text-lg md:text-xl font-semibold text-blue-600 text-center">
      {message || 'Verificando autorização...'}
    </p>
    <p className="text-sm text-gray-500 mt-2 text-center">
      Aguarde, processando dados do QR Code...
    </p>
  </div>
);

export default LoadingComponent;
