import {
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  Box,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import client from "../services/client.js";
import Navbar from "../components/Navbar";
import { format } from "date-fns";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext.js";
import Unauthorized from "../components/Unauthorized/index.js";
import { ptBR } from "date-fns/locale";
import VisitorImage from "../components/VisitorImage";

const Report = () => {
  // Estado para armazenar a data selecionada no input (formato YYYY-MM-DD)
  const [date, setDate] = useState(null);
  // Estado para armazenar a data selecionada como objeto Date, para formatação e exibição
  const [realDate, setRealDate] = useState(null);
  // Estado para armazenar os registros brutos retornados pela API
  const [report, setReport] = useState(null);
  // Estado para armazenar os registros após aplicação de filtros de pesquisa ou tipo
  const [filtered, setFiltered] = useState(null);
  const auth = useAuth();

  // Função chamada quando o valor do input de data é alterado
  const handleChange = (event) => {
    const [ano, mes, dia] = event.target.value.split("-");
    // Define a data real para exibição formatada
    setRealDate(new Date(ano, mes - 1, dia));
    // Define a data para a requisição à API
    setDate(event.target.value);
    // Limpa o relatório anterior ao selecionar uma nova data
    setReport(null);
  };

  // Função para buscar os registros na API com base na data selecionada
  const sendRequest = () => {
    // Verifica se uma data foi selecionada
    if (!date) return;

    const inputDate = new Date(date);

    // Define o período de início para a busca (dia selecionado às 08:00, considerando o fuso horário local)
    // O backend espera o horário de início do serviço (ex: 08:00 do dia selecionado)
    // Adiciona 11 horas para compensar o fuso e garantir que pegue a partir das 08:00 (UTC-3 + 11 = UTC+8, mas o backend ajusta)
    // É importante verificar como o backend trata o fuso horário.
    // Este cálculo pode precisar de ajuste dependendo da lógica do backend para "início do serviço".
    const initialDate = new Date(date).setHours(inputDate.getHours() + 11); // Ajustado para pegar o início do dia de serviço
    const initialToRequest = new Date(initialDate).toISOString();

    // Define o período final para a busca (dia seguinte às 08:00)
    // Adiciona 35 horas para cobrir até as 08:00 do dia seguinte (24h + 11h)
    const finalDate = new Date(date).setHours(inputDate.getHours() + 35); // Ajustado para pegar até o final do dia de serviço
    const finalDateToRequest = new Date(finalDate).toISOString();

    const request = async () => {
      try {
        const response = await client.post("/entries/byDate", {
          initialDate: initialToRequest,
          finalDate: finalDateToRequest,
        });
        // Armazena os dados brutos e os dados filtrados inicialmente
        setReport(response.data);
        setFiltered(response.data);
      } catch (error) {
        console.error("Erro ao buscar registros:", error);
        setReport([]); // Define como array vazio em caso de erro para evitar quebras
        setFiltered([]);
      }
    };
    request();
  };

  // Função para filtrar os registros com base no texto digitado na pesquisa
  const handleSearch = (event) => {
    if (!report) return; // Não faz nada se não houver dados
    const searchTerm = event.target.value.toLowerCase();
    // O parâmetro da função de callback do filter (aqui chamado 'item')
    // representa cada elemento do array 'report' durante a iteração.
    const filteredData = report.filter(
      (item) => // <<< CORREÇÃO: Usar 'item' (ou qualquer nome de parâmetro) aqui
        (item.name && item.name.toLowerCase().includes(searchTerm)) ||
        (item.licensePlate && item.licensePlate.toLowerCase().includes(searchTerm)) || // Comparar com searchTerm também para consistência
        (item.color && item.color.toLowerCase().includes(searchTerm)) ||
        (item.target &&
          item.target
            .toLowerCase()
            .includes(searchTerm)) ||
        (item.carModel && item.carModel
          .toLowerCase()
          .includes(searchTerm)) ||
        (item.contactPerson &&
          item.contactPerson
            .toLowerCase()
            .includes(searchTerm)) ||
        (item.idNumber && item.idNumber.toLowerCase().includes(searchTerm)) // Adicionar busca por ID/CPF se relevante
    );
    setFiltered(filteredData);
  };

  // Função para filtrar os registros por tipo (Todos, Visitantes, Militares)
  const handleFilter = (value) => { // O evento aqui é o próprio valor do Radio
    if (!report) return;
    switch (value) {
      case "1": // Todos
        setFiltered(report);
        break;
      case "2": // Visitantes
        // Visitantes são aqueles marcados como isVisitor e NÃO são permissionários
        const filteredVisitors = report.filter(
          (entry) => entry.isVisitor && !entry.isPermissionario
        );
        setFiltered(filteredVisitors);
        break;
      case "3": // Militares
        // Militares são aqueles que NÃO são nem visitantes nem permissionários
        const filteredMilitary = report.filter(
          (entry) => !entry.isVisitor && !entry.isPermissionario
        );
        setFiltered(filteredMilitary);
        break;
      case "4": // Permissionários
        // Permissionários são aqueles marcados com isPermissionario
        const filteredPermissionarios = report.filter(
          (entry) => entry.isPermissionario
        );
        setFiltered(filteredPermissionarios);
        break;
      default:
        setFiltered(report); // Caso padrão, mostrar todos
        break;
    }
  };

  // Função para exportar todos os dados (não apenas os do dia selecionado) para Excel
  const exportData = async () => {
    try {
      const entriesResponse = await client.get("/entries");
      const allEntries = entriesResponse.data;

      // Separa visitantes, militares e permissionários para planilhas diferentes
      const visitors = allEntries.filter(
        (entry) => entry.isVisitor && !entry.isPermissionario
      );
      const military = allEntries.filter(
        (entry) => !entry.isVisitor && !entry.isPermissionario
      );
      const permissionarios = allEntries.filter(
        (entry) => entry.isPermissionario
      );

      // Formata os dados dos visitantes para o Excel
      const visitorsFormated = visitors
        .map((visitor) => {
          return {
            datetime: new Date(visitor.time),
            day: format(new Date(visitor.time), "dd/MM/yyyy"),
            name: visitor.name,
            idNumber: visitor.idNumber,
            phoneNumber: visitor.phoneNumber,
            car: `${visitor.carModel} - ${visitor.color}`,
            licensePlate: visitor.licensePlate,
            type: visitor.type, // Entrada ou Saída
            time: format(new Date(visitor.time), "HH:mm:ss"),
            target: visitor.target,
            contactPerson: visitor.contactPerson,
            imagePath: visitor.imagePath, // Adicionado para referência se necessário
          };
        })
        .sort((a, b) => a.datetime - b.datetime);

      // Formata os dados dos militares para o Excel
      const militaryFormated = military
        .map((entry) => {
          return {
            datetime: new Date(entry.time),
            day: format(new Date(entry.time), "dd/MM/yyyy"),
            name: entry.name,
            idNumber: entry.idNumber,
            car: `${entry.carModel} - ${entry.color}`,
            licensePlate: entry.licensePlate,
            type: entry.type, // Entrada ou Saída
            time: format(new Date(entry.time), "HH:mm:ss"),
          };
        })
        .sort((a, b) => a.datetime - b.datetime);

      // Formata os dados dos permissionários para o Excel
      const permissionariosFormated = permissionarios
        .map((entry) => {
          return {
            datetime: new Date(entry.time),
            day: format(new Date(entry.time), "dd/MM/yyyy"),
            name: entry.name,
            idNumber: entry.idNumber,
            CPF: entry.CPF || "N/A", // Incluir CPF se disponível
            carModel: entry.carModel || "N/A", // Incluir modelo do carro
            licensePlate: entry.licensePlate || "N/A", // Incluir placa
            color: entry.color || "N/A", // Incluir cor
            type: entry.type,
            time: format(new Date(entry.time), "HH:mm:ss"),
            hasPhoto: entry.imagePath ? "Sim" : "Não", // Indicar se tem foto
          };
        })
        .sort((a, b) => a.datetime - b.datetime);

      const xlsx = require("json-as-xlsx");
      const dataToExport = [
        {
          sheet: "Visitantes",
          columns: [
            { label: "Dia", value: "day" },
            { label: "Nome", value: "name" },
            { label: "Identidade", value: "idNumber" },
            { label: "Telefone", value: "phoneNumber" },
            { label: "Carro - Cor", value: "car" },
            { label: "Placa", value: "licensePlate" },
            { label: "Entrada/Saída", value: "type" },
            { label: "Hora", value: "time" },
            { label: "Destino", value: "target" },
            { label: "Pessoa de Contato", value: "contactPerson" },
          ],
          content: visitorsFormated,
        },
        {
          sheet: "Militares",
          columns: [
            { label: "Dia", value: "day" },
            { label: "Militar", value: "name" },
            { label: "Identidade", value: "idNumber" },
            { label: "Carro - Cor", value: "car" },
            { label: "Placa", value: "licensePlate" },
            { label: "Entrada/Saída", value: "type" },
            { label: "Hora", value: "time" },
          ],
          content: militaryFormated,
        },
        { // Planilha atualizada para Permissionários
          sheet: "Permissionários",
          columns: [
            { label: "Dia", value: "day" },
            { label: "Nome", value: "name" },
            { label: "Identidade", value: "idNumber" },
            { label: "CPF", value: "CPF" },
            { label: "Veículo", value: "carModel" },
            { label: "Placa", value: "licensePlate" },
            { label: "Cor", value: "color" },
            { label: "Entrada/Saída", value: "type" },
            { label: "Hora", value: "time" },
            { label: "Tem Foto", value: "hasPhoto" },
          ],
          content: permissionariosFormated,
        },
      ];

      const settings = {
        fileName: `Relatório gerado dia ${format(new Date(), "dd/MM/yyy")}`,
        extraLenght: 3,
        writeOptions: {},
      };

      xlsx(dataToExport, settings);
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
    }
  };

  // useEffect para buscar os dados sempre que a 'date' mudar
  useEffect(() => {
    sendRequest();
  }, [date]);

  // Verifica a permissão do usuário para acessar esta rota
  if (
    auth.user.role !== "S2" &&
    auth.user.role !== "Scmt" &&
    auth.user.role !== "Ofdia"
  )
    return <Unauthorized />;

  return (
    <>
      <Navbar />
      {/* Formulário para seleção de data, pesquisa e filtros */}
      <SFormControl>
        <FormControl
          p={5}
          display={"flex"}
          justifyContent={"space-evenly"}
          alignItems="center"
        >
          <FormLabel htmlFor="data">
            Selecione a data de início do serviço:{" "}
            <Input
              width={"400px"}
              name="data"
              type="date"
              onChange={handleChange} // Define a data para a busca
            />
          </FormLabel>
          <FormLabel htmlFor="search">
            Pesquisa:{" "}
            <Input
              width={"400px"}
              name="search"
              type="text"
              onChange={handleSearch} // Filtra os resultados exibidos
            />
          </FormLabel>
          <FormLabel htmlFor="filter" display={"flex"}>
            Filtro:{" "}
            <RadioGroup
              onChange={handleFilter} // Filtra por tipo de registro
              pl={8}
              name="filter"
              width={"auto"} // Ajustar largura para acomodar nova opção
              defaultValue="1" // "Todos" selecionado por padrão
            >
              <Stack spacing={4} direction="row">
                <Radio value="1" defaultChecked>
                  Todos
                </Radio>
                <Radio value="2">Visitantes</Radio>
                <Radio value="3">Militares</Radio>
                <Radio value="4">Permissionários</Radio> {/* Nova Opção */}
              </Stack>
            </RadioGroup>
          </FormLabel>
          <FormLabel>
            {/* Botão de exportar para Excel, visível apenas para SCMT e S2 */}
            {(auth.user.role === "Scmt" || auth.user.role === "S2") && (
              <Button colorScheme={"red"} onClick={exportData}>
                Exportar Excel
              </Button>
            )}
          </FormLabel>
        </FormControl>
      </SFormControl>

      {/* Seção para exibir a tabela de registros do dia selecionado */}
      {filtered ? ( // Renderiza apenas se houver dados filtrados (ou todos os dados do dia)
        <Box
          pl={5}
          pr={5}
          display="flex"
          flexDirection={"column"}
          alignItems="center"
        >
          {/* Exibe a data do serviço formatada */}
          {realDate && (
            <SText>
              Serviço do dia:{" "}
              {format(realDate, "dd MMM yyyy", { locale: ptBR }).toUpperCase()}
            </SText>
          )}

          {/* Tabela de registros */}
          <STable size="sm" variant="striped" colorScheme="red">
            <Thead>
              <Tr>
                <Th textAlign="center">Foto</Th>
                <Th textAlign="center">Nome</Th>
                <Th textAlign="center">Identidade</Th>
                <Th textAlign="center">Tel. Ctt</Th>
                <Th textAlign="center">Placa</Th>
                <Th textAlign="center">Carro - Cor</Th>
                <Th textAlign="center">Tipo</Th>
                <Th textAlign="center">Hora</Th>
                <Th textAlign="center">Destino</Th>
                <Th textAlign="center">Pessoa de contato</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* Mapeia os registros filtrados para as linhas da tabela */}
              {filtered.map((entry) => {
                const formatedTime = format(new Date(entry.time), "HH:mm:ss");

                // Determinar o tipo de usuário para melhor exibição
                const userType = entry.isPermissionario ? "Permissionário" :
                  entry.isVisitor ? "Visitante" : "Militar";

                return (
                  <STr key={entry.id}>
                    <Td width="80px">
                      {/* Componente para exibir a imagem, com fallback para diferentes tipos */}
                      <VisitorImage
                        imagePath={entry.imagePath}
                        alt={`Foto de ${entry.name} (${userType})`}
                      />
                    </Td>
                    <Td>
                      {entry.name}
                      {/* Indicador visual do tipo de usuário */}
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {userType}
                      </Text>
                    </Td>
                    <Td textAlign="center">{entry.idNumber}</Td>
                    <Td textAlign="center">
                      {/* Para permissionários, exibir CPF se não houver telefone */}
                      {entry.phoneNumber || (entry.isPermissionario ? entry.CPF : "N/A")}
                    </Td>
                    <Td textAlign="center">{entry.licensePlate}</Td>
                    <Td textAlign="center">
                      {entry.carModel + " - " + entry.color}
                    </Td>
                    <Td textAlign="center">{entry.type}</Td>
                    <Td textAlign="center">{formatedTime}</Td>
                    <Td textAlign="center">
                      {/* Target é específico para visitantes */}
                      {entry.isVisitor ? entry.target : "N/A"}
                    </Td>
                    <Td textAlign="center">
                      {/* Pessoa de contato é específico para visitantes */}
                      {entry.isVisitor ? entry.contactPerson : "N/A"}
                    </Td>
                  </STr>
                );
              })}
            </Tbody>
          </STable>
        </Box>
      ) : null}
    </>
  );
};

// Styled components para estilização específica de impressão e layout
export const SFormControl = styled.form`
  @media print {
    display: none; // Oculta o formulário de filtros na impressão
  }
`;

export const SText = styled(Text)`
  display: none; // Oculto por padrão
  font-size: 1.2rem;
  font-weight: 700;

  @media print {
    display: flex; // Exibe o texto da data do serviço na impressão
  }
`;

export const STable = styled(Table)`
  table-layout: fixed;
  width: 100%;
  
  @media print {
    font-size: 8px; // Reduz o tamanho da fonte para impressão
  }
`;

export const STr = styled(Tr)`
  vertical-align: middle;
  
  @media print {
    font-size: 6px; // Reduz ainda mais o tamanho da fonte nas linhas para impressão
    border: 2px solid black; // Adiciona borda para melhor visualização na impressão
    page-break-inside: avoid; // Tenta evitar quebra de página dentro de uma linha
  }
`;

export default Report;
