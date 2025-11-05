import { useNavigate } from "react-router-dom";
import {
  FormLabel,
  Button,
  Box,
  Badge,
  Select,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import * as S from "../VisitorForm/styles.js"; // Reutilizar estilos do VisitorForm
import client from "../../services/client.js";
import { useState } from "react";
import InputMask from "react-input-mask";

const ScheduleVisitorForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    // Combinar data e hora para formar scheduledDate
    const scheduleDate = formData.get("scheduleDate");
    const scheduleTime = formData.get("scheduleTime");

    if (!scheduleDate || !scheduleTime) {
      alert("Por favor, preencha data e hora do agendamento");
      setIsLoading(false);
      return;
    }

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

    // Verificar se a data é futura
    if (scheduledDateTime <= new Date()) {
      alert("A data e hora do agendamento deve ser futura");
      setIsLoading(false);
      return;
    }

    const data = {
      isVisitor: true,
      isScheduled: true, // Novo campo
      scheduledDate: scheduledDateTime.toISOString(), // Novo campo
      name: formData.get("completeName"),
      idNumber: formData.get("idNumber"),
      phoneNumber: formData.get("phoneNumber"),
      licensePlate: formData.get("licensePlate"),
      carModel: formData.get("carModel"),
      color: formData.get("color"),
      contactPerson: formData.get("contactPerson"),
      target: formData.get("section"),
      type: "Entrada", // Agendamentos são sempre entradas
    };

    try {
      await client.post("/entries/schedule", data);
      alert("Agendamento realizado com sucesso!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Erro ao agendar visitante:", error);
      alert("Erro ao realizar agendamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Container>
      <S.Form onSubmit={handleSubmit}>
        <S.StyledFormControl>
          <Alert status="info" mb={4}>
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Agendamento de Visitante</Text>
              <Text fontSize="sm">
                A foto será capturada pela guarda no momento da entrada
              </Text>
            </Box>
          </Alert>

          <S.StyledGrid templateColumns="repeat(4, 1fr)" gap={1}>
            {/* Dados do Agendamento */}
            <Box w="90%" p={1} h="auto" minH="200px" maxH="400px">
              <Badge fontSize="1.1rem" mb="1rem" colorScheme="blue">
                Dados do Agendamento
              </Badge>
              <FormLabel htmlFor="scheduleDate">Data do Agendamento</FormLabel>
              <S.StyledInput
                type="date"
                name="scheduleDate"
                required
                min={new Date().toISOString().split("T")[0]} // Data mínima = hoje
              />
              <FormLabel htmlFor="scheduleTime">Hora do Agendamento</FormLabel>
              <S.StyledInput type="time" name="scheduleTime" required />
            </Box>

            {/* Dados pessoais */}
            <Box w="90%" p={1} h="auto" minH="200px" maxH="400px">
              <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
                Dados pessoais
              </Badge>
              <FormLabel htmlFor="completeName">Nome Completo</FormLabel>
              <S.StyledInput
                type="text"
                name="completeName"
                placeholder="Nome completo do visitante"
                pattern="[A-Za-zÀ-ÿ\s]{3,}"
                title="Nome deve ter pelo menos 3 caracteres"
                minLength="3"
                style={{ textTransform: "capitalize" }}
                required
              />
              <FormLabel htmlFor="idNumber">CPF do Visitante</FormLabel>
              <S.StyledInput
                type="text"
                name="idNumber"
                placeholder="000.000.000-00"
                pattern="[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}"
                title="Digite um CPF válido (000.000.000-00)"
                maxLength="14"
                onInput={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 11) {
                    value = value.replace(/(\d{3})(\d)/, "$1.$2");
                    value = value.replace(/(\d{3})(\d)/, "$1.$2");
                    value = value.replace(/(\d{3})(\d{1,2})/, "$1-$2");
                    e.target.value = value;
                  }
                }}
                required
              />
              <FormLabel htmlFor="phoneNumber">Telefone de Contato</FormLabel>
              <S.StyledInput
                type="tel"
                name="phoneNumber"
                placeholder="(11) 99999-9999"
                pattern="\([0-9]{2}\)\s[0-9]{4,5}-[0-9]{4}"
                title="Digite um telefone válido (DD) 9XXXX-XXXX"
                maxLength="15"
                onInput={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 11) {
                    value = value.replace(/(\d{2})(\d)/, "($1) $2");
                    value = value.replace(/(\d{5})(\d{1,4})/, "$1-$2");
                    e.target.value = value;
                  }
                }}
                required
              />
            </Box>

            {/* Dados do veículo */}
            <Box w="90%" p={1} h="auto" minH="200px" maxH="400px">
              <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
                Dados do veículo
              </Badge>
              <FormLabel htmlFor="carModel">Modelo do veículo</FormLabel>
              <S.StyledInput type="text" name="carModel" required />
              <FormLabel htmlFor="licensePlate">Placa</FormLabel>
              <S.StyledInput
                type="text"
                name="licensePlate"
                placeholder="ABC-1234 ou ABC1D23"
                pattern="[A-Z]{3}-?[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2}"
                title="Digite uma placa brasileira válida"
                maxLength="8"
                style={{ textTransform: "uppercase" }}
                onInput={(e) => {
                  let value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "");
                  if (value.length <= 7) {
                    if (
                      value.length === 7 &&
                      /^[A-Z]{3}[0-9]{4}$/.test(value)
                    ) {
                      value = value.replace(/([A-Z]{3})([0-9]{4})/, "$1-$2");
                    }
                    e.target.value = value;
                  }
                }}
                required
              />
              <FormLabel htmlFor="color">Cor</FormLabel>
              <S.StyledInput type="text" name="color" required />
            </Box>

            {/* Dados do Destino */}
            <Box w="90%" p={1} h="auto" minH="200px" maxH="400px">
              <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
                Dados do Destino
              </Badge>
              <FormLabel htmlFor="contactPerson">Com quem vai falar:</FormLabel>
              <S.StyledInput type="text" name="contactPerson" required />
              <FormLabel htmlFor="section">Seção de Destino</FormLabel>
              <Select name="section" required>
                <option value="">Selecione...</option>
                <option value="RP">RP</option>
                <option value="SFPC">SFPC</option>
                <option value="Cmt">Cmt</option>
                <option value="SCmt">Scmt</option>
                <option value="Estande">Estande</option>
                <option value="Adj Cmdo">Adj Cmdo</option>
                <option value="SecInfor">SecInfor</option>
                <option value="SecJur">SecJur</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
                <option value="S4">S4</option>
                <option value="Pelotões">Pelotões</option>
                <option value="SubCias">SubCias</option>
                <option value="Outros">Outros</option>
              </Select>
            </Box>
          </S.StyledGrid>

          <S.StyledBox>
            <Button
              colorScheme="blue"
              type="submit"
              size="lg"
              isLoading={isLoading}
              loadingText="Agendando..."
            >
              Agendar Visitante
            </Button>
          </S.StyledBox>
        </S.StyledFormControl>
      </S.Form>
    </S.Container>
  );
};

export default ScheduleVisitorForm;
