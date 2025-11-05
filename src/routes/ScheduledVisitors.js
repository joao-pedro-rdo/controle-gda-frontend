import { Box, Button, SimpleGrid, Text, Badge, Alert, AlertIcon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import client from "../services/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Unauthorized from "../components/Unauthorized";

const ScheduledVisitors = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [scheduledVisitors, setScheduledVisitors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Buscar agendamentos do dia atual - SEMPRE chamar os hooks primeiro
  useEffect(() => {
    // Permitir busca para Guarda e SFPC
    if (auth.user.role === "Guarda" || auth.user.role === "SFPC" || auth.user.role === "S2") {
      const fetchScheduledVisitors = async () => {
        try {
          setLoading(true);
          const today = new Date().toISOString().split('T')[0];
          console.log("Buscando agendamentos para:", today);

          const response = await client.get(`/entries/scheduled?date=${today}`);
          console.log("Resposta agendamentos:", response.data);

          setScheduledVisitors(response.data || []);
        } catch (error) {
          console.error("Erro ao buscar agendamentos:", error);
          setScheduledVisitors([]);
        } finally {
          setLoading(false);
        }
      };

      fetchScheduledVisitors();
    }
  }, [auth.user.role]);

  const handleConfirmScheduled = (scheduledVisitor) => {
    navigate("/visitante", {
      state: { scheduledVisitor }
    });
  };

  // Verificar permissão APÓS os hooks - Incluir SFPC
  if (auth.user.role !== "Guarda" && auth.user.role !== "SFPC" && auth.user.role !== "S2") {
    return <Unauthorized />;
  }

  return (
    <>
      <Navbar />
      <Box w="100%" p={5} minH="80vh">
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          Agendamentos do Dia
        </Text>

        {loading ? (
          <Alert status="info">
            <AlertIcon />
            <Text>Carregando agendamentos...</Text>
          </Alert>
        ) : scheduledVisitors.length > 0 ? (
          <>
            <Alert status="info" mb={6}>
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Agendamentos para Hoje</Text>
                <Text fontSize="sm">{scheduledVisitors.length} visitante(s) agendado(s)</Text>
                <Text fontSize="xs" color="gray.600" mt={1}>
                  Data: {new Date().toLocaleDateString('pt-BR')}
                </Text>
              </Box>
            </Alert>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} maxW="1200px" mx="auto">
              {scheduledVisitors.map((visitor) => (
                <Box
                  key={visitor.id}
                  p={5}
                  borderWidth="2px"
                  borderRadius="lg"
                  borderColor="blue.300"
                  bg="blue.50"
                  boxShadow="lg"
                  _hover={{ boxShadow: "xl", transform: "translateY(-2px)" }}
                  transition="all 0.2s"
                >
                  <Badge colorScheme="blue" mb={3} fontSize="sm" p={1}>
                    AGENDADO
                  </Badge>

                  <Text fontWeight="bold" fontSize="xl" mb={2} color="blue.800">
                    {visitor.name}
                  </Text>

                  <Box spacing={1} mb={4}>
                    <Text fontSize="sm" color="gray.700">
                      <strong>ID:</strong> {visitor.idNumber}
                    </Text>
                    <Text fontSize="sm" color="gray.700">
                      <strong>Telefone:</strong> {visitor.phoneNumber || "N/A"}
                    </Text>
                    <Text fontSize="sm" color="gray.700">
                      <strong>Veículo:</strong> {visitor.carModel} - {visitor.color}
                    </Text>
                    <Text fontSize="sm" color="gray.700">
                      <strong>Placa:</strong> {visitor.licensePlate}
                    </Text>
                    <Text fontSize="sm" color="gray.700">
                      <strong>Destino:</strong> {visitor.target}
                    </Text>
                    <Text fontSize="sm" color="gray.700">
                      <strong>Contato:</strong> {visitor.contactPerson}
                    </Text>
                  </Box>

                  <Box
                    p={3}
                    bg="blue.100"
                    borderRadius="md"
                    mb={4}
                    textAlign="center"
                  >
                    <Text fontSize="lg" fontWeight="bold" color="blue.700">
                      Horário Agendado
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color="blue.800">
                      {format(new Date(visitor.scheduledDate), "HH:mm", { locale: ptBR })}
                    </Text>
                    <Text fontSize="sm" color="blue.600">
                      {format(new Date(visitor.scheduledDate), "dd/MM/yyyy", { locale: ptBR })}
                    </Text>
                  </Box>

                  {/* Botão só aparece para Guarda */}
                  {auth.user.role === "Guarda" && (
                    <Button
                      size="lg"
                      colorScheme="green"
                      width="100%"
                      onClick={() => handleConfirmScheduled(visitor)}
                      _hover={{ bg: "green.600" }}
                    >
                      Registrar Entrada
                    </Button>
                  )}

                  {/* Texto informativo para SFPC */}
                  {auth.user.role === "SFPC" || auth.user.role === "S2" && (
                    <Box
                      p={3}
                      bg="gray.100"
                      borderRadius="md"
                      textAlign="center"
                    >
                      <Text fontSize="sm" color="gray.600" fontStyle="italic">
                        Apenas visualização - Registro feito pela Guarda
                      </Text>
                    </Box>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          </>
        ) : (
          <Box textAlign="center" mt={10}>
            <Alert status="success" maxW="md" mx="auto">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Nenhum agendamento para hoje</Text>
                <Text fontSize="sm">Não há visitantes agendados para hoje.</Text>
              </Box>
            </Alert>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ScheduledVisitors;