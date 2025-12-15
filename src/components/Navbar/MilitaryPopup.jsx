import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Box,
  Text,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  Badge,
  Flex,
  Spinner,
  Input,
  Button,
  HStack,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import client from "../../services/client";
import VisitorImage from "../VisitorImage";

const MilitaryPopup = ({ isOpen, onClose }) => {
  const [militaryEntries, setMilitaryEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Estados para os filtros
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [useCustomRange, setUseCustomRange] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Inicializar com a data de hoje
      const today = new Date().toISOString().split("T")[0];
      setStartDate(today);
      setEndDate(today);
      fetchTodayMilitary();
    }
  }, [isOpen]);

  const fetchTodayMilitary = async () => {
    setLoading(true);
    try {
      // Obter data atual no formato YYYY-MM-DD (como se fosse input do usuário)
      const today = new Date();
      const dateString = today.toISOString().split("T")[0];

      // Usar a MESMA lógica do Report.js
      const inputDate = new Date(dateString);
      const initialDate = new Date(dateString).setHours(
        inputDate.getHours() + 11
      );
      const finalDate = new Date(dateString).setHours(
        inputDate.getHours() + 35
      );

      const initialToRequest = new Date(initialDate).toISOString();
      const finalDateToRequest = new Date(finalDate).toISOString();

      console.log("🔍 Buscando militares (mesma lógica do Report):", {
        dateString,
        initialToRequest,
        finalDateToRequest,
      });

      const response = await client.post("/entries/byDate", {
        initialDate: initialToRequest,
        finalDate: finalDateToRequest,
      });

      // Filtrar apenas militares
      const military = response.data.filter(
        (entry) => !entry.isVisitor && !entry.isPermissionario
      );

      console.log("👥 Militares encontrados:", military.length);
      setMilitaryEntries(military);
    } catch (error) {
      console.error("❌ Erro ao buscar militares:", error);
      toast({
        title: "Erro ao buscar militares",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setMilitaryEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomRange = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Datas obrigatórias",
        description: "Por favor, selecione as datas inicial e final",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      // Combinar data com horário
      const initialDateTime = new Date(`${startDate}T${startTime}:00`);
      const finalDateTime = new Date(`${endDate}T${endTime}:59`);

      const initialToRequest = initialDateTime.toISOString();
      const finalDateToRequest = finalDateTime.toISOString();

      console.log("🔍 Buscando militares com range customizado:", {
        startDate,
        endDate,
        startTime,
        endTime,
        initialToRequest,
        finalDateToRequest,
      });

      const response = await client.post("/entries/byDate", {
        initialDate: initialToRequest,
        finalDate: finalDateToRequest,
      });

      // Filtrar apenas militares
      const military = response.data.filter(
        (entry) => !entry.isVisitor && !entry.isPermissionario
      );

      console.log("👥 Militares encontrados:", military.length);
      setMilitaryEntries(military);

      toast({
        title: "Busca realizada com sucesso",
        description: `${military.length} militares encontrados`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("❌ Erro ao buscar militares:", error);
      toast({
        title: "Erro ao buscar militares",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setMilitaryEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCustomRange = () => {
    setUseCustomRange(!useCustomRange);
    if (!useCustomRange) {
      // Ao ativar filtro customizado, já buscar
      fetchCustomRange();
    } else {
      // Ao desativar, voltar para hoje
      fetchTodayMilitary();
    }
  };

  // Separar entradas por tipo
  const entries = militaryEntries.filter((entry) => entry.type === "Entrada");
  const exits = militaryEntries.filter((entry) => entry.type === "Saída");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxHeight="90vh">
        <ModalHeader>
          <Flex align="center" justify="space-between">
            <Text>Militares no Serviço</Text>
            <Badge colorScheme="blue" fontSize="lg">
              {entries.length} militares dentro da OM
            </Badge>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {/* Seção de Filtros */}
          <Box bg="gray.50" p={4} borderRadius="md" mb={6}>
            <Flex align="center" justify="space-between" mb={4}>
              <Text fontSize="lg" fontWeight="bold">
                🔍 Filtros de Busca
              </Text>
              <Button
                size="sm"
                colorScheme={useCustomRange ? "blue" : "gray"}
                onClick={handleToggleCustomRange}
              >
                {useCustomRange ? "Voltar para Hoje" : "Range Customizado"}
              </Button>
            </Flex>

            {useCustomRange && (
              <VStack spacing={4} align="stretch">
                <HStack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm">Data Inicial</FormLabel>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      bg="white"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Horário Inicial</FormLabel>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      bg="white"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Data Final</FormLabel>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      bg="white"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Horário Final</FormLabel>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      bg="white"
                    />
                  </FormControl>
                </HStack>

                <Button
                  colorScheme="blue"
                  onClick={fetchCustomRange}
                  isLoading={loading}
                >
                  Buscar
                </Button>
              </VStack>
            )}

            {!useCustomRange && (
              <Text fontSize="sm" color="gray.600">
                📅 Mostrando militares de hoje (11h de hoje até 11h de amanhã)
              </Text>
            )}
          </Box>

          {loading ? (
            <Flex justify="center" align="center" py={8}>
              <Spinner size="lg" />
              <Text ml={4}>Carregando militares...</Text>
            </Flex>
          ) : (
            <VStack spacing={6} align="stretch">
              {/* Seção de Militares Atualmente na OM */}
              <Box>
                <Text fontSize="xl" fontWeight="bold" mb={4} color="green.600">
                  📍 Militares Atualmente na OM ({entries.length})
                </Text>
                {entries.length === 0 ? (
                  <Text color="gray.500" textAlign="center" py={4}>
                    Nenhum militar dentro da OM no momento
                  </Text>
                ) : (
                  <Table size="sm" variant="striped" colorScheme="green">
                    <Thead>
                      <Tr>
                        <Th>Foto</Th>
                        <Th>Nome</Th>
                        <Th>Identidade</Th>
                        <Th>Veículo</Th>
                        <Th>Placa</Th>
                        <Th>Entrada</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {entries.map((entry) => (
                        <Tr key={entry.id}>
                          <Td width="60px">
                            <VisitorImage
                              imagePath={entry.imagePath}
                              alt={`Foto de ${entry.name}`}
                              boxSize="40px"
                              borderRadius="full"
                              objectFit="cover"
                            />
                          </Td>
                          <Td fontWeight="semibold">{entry.name}</Td>
                          <Td>{entry.idNumber}</Td>
                          <Td>
                            {entry.carModel} - {entry.color}
                          </Td>
                          <Td>{entry.licensePlate}</Td>
                          <Td>{format(new Date(entry.time), "dd/MM/yyyy HH:mm")}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>

              {/* Seção de Saídas do Dia */}
              {exits.length > 0 && (
                <Box>
                  <Text fontSize="xl" fontWeight="bold" mb={4} color="red.600">
                    🚪 Saídas Registradas ({exits.length})
                  </Text>
                  <Table size="sm" variant="striped" colorScheme="red">
                    <Thead>
                      <Tr>
                        <Th>Foto</Th>
                        <Th>Nome</Th>
                        <Th>Identidade</Th>
                        <Th>Veículo</Th>
                        <Th>Placa</Th>
                        <Th>Saída</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {exits.map((entry) => (
                        <Tr key={entry.id}>
                          <Td width="60px">
                            <VisitorImage
                              imagePath={entry.imagePath}
                              alt={`Foto de ${entry.name}`}
                              boxSize="40px"
                              borderRadius="full"
                              objectFit="cover"
                            />
                          </Td>
                          <Td fontWeight="semibold">{entry.name}</Td>
                          <Td>{entry.idNumber}</Td>
                          <Td>
                            {entry.carModel} - {entry.color}
                          </Td>
                          <Td>{entry.licensePlate}</Td>
                          <Td>{format(new Date(entry.time), "dd/MM/yyyy HH:mm")}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}

              {/* Resumo */}
              <Box bg="gray.50" p={4} borderRadius="md">
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  📊 Resumo do Período
                </Text>
                <Flex gap={6}>
                  <Text>
                    <strong>Entradas:</strong> {entries.length}
                  </Text>
                  <Text>
                    <strong>Saídas:</strong> {exits.length}
                  </Text>
                  <Text>
                    <strong>Dentro da OM:</strong> {entries.length}
                  </Text>
                </Flex>
              </Box>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MilitaryPopup;
