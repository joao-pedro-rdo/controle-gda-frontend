import { Box, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import client from "../services/client";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import styled from "styled-components";
import VisitorImage from "../components/VisitorImage";
import DashboardSta from "../components/DashboardSta";
import { Badge } from "@chakra-ui/react";
import { MdCalendarToday } from "react-icons/md";

const Dashboard = () => {
  const auth = useAuth();
  const [entries, setEntries] = useState();

  useEffect(() => {
    const request = async () => {
      const response = await client.get("/entries");
      if (response?.data) {
        setEntries(response.data);
      }
    };
    request();
  }, []);

  const handleExit = async (id) => {
    try {
      // Buscar os dados completos da entrada
      const entryResponse = await client.get(`/entries/${id}`);
      const entryData = entryResponse.data;

      console.log("📋 Dados da entrada para saída:", entryData);

      // 🎯 USAR NOVA ROTA ESPECÍFICA PARA SAÍDAS
      const exitPayload = {
        entryId: id,
        name: entryData.name,
        idNumber: entryData.idNumber,
        phoneNumber: entryData.phoneNumber,
        licensePlate: entryData.licensePlate,
        carModel: entryData.carModel,
        color: entryData.color,
        target: entryData.target,
        contactPerson: entryData.contactPerson,
        isVisitor: entryData.isVisitor,
        isPermissionario: entryData.isPermissionario,
        imagePath: entryData.imagePath, // ← Passar imagePath diretamente
      };

      // Se for permissionário, adicionar CPF
      if (entryData.isPermissionario && entryData.idNumber) {
        exitPayload.CPF = entryData.idNumber;
      }

      console.log("📤 Payload da saída sendo enviado:", exitPayload);

      // Chamar nova rota de saída
      const response = await client.post("/exits", exitPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Saída registrada com sucesso:", response.data);

      // Recarregar os dados após a atualização
      const entriesResponse = await client.get("/entries");
      if (entriesResponse?.data) {
        setEntries(entriesResponse.data);
      }
    } catch (error) {
      console.error("❌ Erro ao registrar saída:", error);
      console.error("❌ Detalhes do erro:", error.response?.data);
      alert("Erro ao registrar saída. Tente novamente.");
    }
  };

  return (
    <>
      <Navbar />
      <Bg />

      {auth.user.role === "Scmt" ||
      auth.user.role === "RP" ||
      auth.user.role === "Ofdia" ||
      auth.user.role === "S2" ||
      auth.user.role === "Guarda" ? (
        <Wrapper>
          {entries &&
            entries.map((el) => {
              const date = Date.parse(el.time);
              const newDate = format(date, "dd/MM/y HH:mm:ss", {
                locale: pt,
              });

              return (el.isVisitor &&
                el.isScheduled != true &&
                !el.exited &&
                el.type === "Entrada") ||
                (el.isPermissionario === true &&
                  !el.exited &&
                  el.type === "Entrada") ? (
                <StyledBox
                  key={el.id}
                  maxW="sm"
                  borderWidth="2px"
                  borderRadius="lg"
                  overflow="hidden"
                  m="0.5rem"
                  padding="0.5rem"
                  bgColor="white"
                >
                  <Box display="flex" alignItems="baseline">
                    <Badge
                      borderRadius="full"
                      px="2"
                      colorScheme="teal"
                      w="100%"
                      textAlign="center"
                      fontSize="0.9rem"
                    >
                      {el.type}: {newDate}
                    </Badge>
                  </Box>
                  <InnerBox>
                    <div className="content-container">
                      <div className="photo-container">
                        <VisitorImage imagePath={el.imagePath} />
                      </div>

                      <div className="info-container">
                        <Box mt="1" as="h4" lineHeight="tight">
                          Nome: <strong>{el.name}</strong>
                        </Box>
                        <Box mt="1" as="h4" lineHeight="tight">
                          Telefone: <strong>{el.phoneNumber}</strong>
                        </Box>
                        <Box mt="1" as="h4" lineHeight="tight">
                          Carro:{" "}
                          <strong>
                            {el.carModel} - {el.color}
                          </strong>
                        </Box>
                        <Box mt="1" as="h4" lineHeight="tight">
                          Placa: <strong>{el.licensePlate}</strong>
                        </Box>
                        <Box mt="1" as="h4" lineHeight="tight">
                          Destino: <strong>{el.target}</strong>
                        </Box>

                        {/* 🎯 CONDIÇÃO ADICIONADA: Mostrar PERMISSIONÁRIO ou Contato */}
                        <Box mt="1" as="h4" lineHeight="tight">
                          {el.isPermissionario ? (
                            <Box mt="1" as="h4" lineHeight="tight">
                              Tipo:{" "}
                              <Badge
                                ml="2"
                                colorScheme="green"
                                variant="solid"
                                fontSize="0.8em"
                              >
                                PERMISSIONÁRIO
                              </Badge>
                            </Box>
                          ) : (
                            <Box mt="1" as="h4" lineHeight="tight">
                              Contato: <strong>{el.contactPerson}</strong>
                            </Box>
                          )}
                        </Box>
                      </div>
                    </div>
                    <div className="button-container">
                      {auth && auth.user.role === "Guarda" ? (
                        <Button
                          onClick={() => handleExit(el.id)}
                          colorScheme="red"
                          width="100%"
                          size="md"
                        >
                          Saída
                        </Button>
                      ) : null}
                    </div>
                  </InnerBox>
                </StyledBox>
              ) : null;
            })}
        </Wrapper>
      ) : auth.user.role === "Sta" || auth.user.role === "Fiscal" ? (
        <DashboardSta />
      ) : (
        <Text>Perfil não definido ainda</Text>
      )}
      <Footer>
        <Text fontStyle={"italic"}>Desenvolvido pelo 3° Sgt Ramos</Text>
      </Footer>
    </>
  );
};

const Footer = styled.div`
  position: fixed;
  top: 97vh;
  left: 2%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: auto;
  width: 90%;
  margin-top: 10px;
  border-radius: 20px;
`;

const Bg = styled.img`
  @media (min-width: 700px) {
    background-image: url("img/bg-cover.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    height: 100vh;
    width: 100%;
    opacity: 0.2;
    position: fixed;
    z-index: -1;
    top: 5%;
  }
`;

const StyledBox = styled(Box)`
  width: 400px;
  border: 2px solid black;
  min-height: 200px;
  @media (max-width: 700px) {
    width: 90%;
  }
`;

// Modifique o styled component InnerBox
const InnerBox = styled.div`
  display: flex;
  flex-direction: column;

  .content-container {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;

    .photo-container {
      flex: 0 0 auto;
      margin-right: 10px;
    }

    .info-container {
      flex: 1;
      min-width: 0;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
  }

  .button-container {
    width: 100%;
    margin-top: 8px;
    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

export default Dashboard;
