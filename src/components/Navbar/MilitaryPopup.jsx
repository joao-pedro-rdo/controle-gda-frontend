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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import client from "../../services/client";
import VisitorImage from "../VisitorImage";

const MilitaryPopup = ({ isOpen, onClose }) => {
  const [militaryEntries, setMilitaryEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTodayMilitary();
    }
  }, [isOpen]);

  const fetchTodayMilitary = async () => {
    setLoading(true);
    try {
      // 🎯 USAR EXATAMENTE A MESMA LÓGICA DO REPORT.JS

      // Obter data atual no formato YYYY-MM-DD (como se fosse input do usuário)
      const today = new Date();
      const dateString = today.toISOString().split("T")[0]; // "2023-10-20"

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
      setMilitaryEntries([]);
    } finally {
      setLoading(false);
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
            <Text>
              Militares no Serviço - {format(new Date(), "dd/MM/yyyy")}
            </Text>
            <Badge colorScheme="blue" fontSize="lg">
              {entries.length} militares dentro da OM
            </Badge>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
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
                          <Td>{format(new Date(entry.time), "HH:mm")}</Td>
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
                    🚪 Saídas Registradas Hoje ({exits.length})
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
                          <Td>{format(new Date(entry.time), "HH:mm")}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}

              {/* Resumo */}
              <Box bg="gray.50" p={4} borderRadius="md">
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  📊 Resumo do Dia
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
