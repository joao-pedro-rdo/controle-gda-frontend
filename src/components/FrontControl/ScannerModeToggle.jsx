import { FormControl, FormHelperText, Switch } from '@chakra-ui/react';

const ScannerModeToggle = ({ useCameraScanner, onToggle }) => (
  <FormControl display="flex" alignItems="center" justifyContent="center" mb={4}>
    <FormHelperText mr={2}>Leitor Físico</FormHelperText>
    <Switch
      id="scanner-mode"
      isChecked={useCameraScanner}
      onChange={onToggle}
      colorScheme="green"
    />
    <FormHelperText ml={2}>Câmera</FormHelperText>
  </FormControl>
);

export default ScannerModeToggle;
