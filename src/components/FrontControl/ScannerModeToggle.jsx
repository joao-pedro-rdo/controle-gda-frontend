import { FormControl, FormHelperText, Switch } from '@chakra-ui/react';

const ScannerModeToggle = ({ useCameraScanner, onToggle }) => (
  <FormControl
    display="flex"
    alignItems="center"
    justifyContent="center"
    mb={4}
    className="flex-wrap gap-2"
  >
    <FormHelperText mr={2} className="text-sm md:text-base m-0">
      Leitor Físico
    </FormHelperText>
    <Switch
      id="scanner-mode"
      isChecked={useCameraScanner}
      onChange={onToggle}
      colorScheme="green"
      size={{ base: 'md', md: 'lg' }}
    />
    <FormHelperText ml={2} className="text-sm md:text-base m-0">
      Câmera
    </FormHelperText>
  </FormControl>
);

export default ScannerModeToggle;
