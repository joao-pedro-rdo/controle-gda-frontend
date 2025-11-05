import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import client from "../services/client";
import QRCode from "qrcode";

import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Box,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import Unauthorized from "../components/Unauthorized";

const ListVehicles = () => {
  const auth = useAuth();
  const [data, setData] = useState();
  const [deleted, setDeleted] = useState(null);
  const [qrCodes, setQrCodes] = useState({});

  useEffect(() => {
    const request = async () => {
      const response = await client.get("/vehicles");
      if (response?.data) {
        const viaturas = response.data.sort((a, b) => {
          if (a.completeName > b.completeName) {
            return 1;
          }
          if (a.completeName < b.completeName) {
            return -1;
          }
          return 0;
        });
        setData(viaturas);
      }
    };
    request();
  }, [deleted]);

  // Gerar o QR Code para um veículo específico
  const generateQRCode = async (vehicle) => {
    try {
      const stringify = `{"licensePlate": ${JSON.stringify(vehicle.licensePlate)}}`;
      const response = await QRCode.toDataURL(stringify);
      setQrCodes((prev) => ({
        ...prev,
        [vehicle.id]: response,
      }));
      return response;
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      return null;
    }
  };

  // Função para realizar o download do QR Code
  const handleDownloadQRCode = async (vehicle) => {
    // Verificar se já temos o QR Code gerado
    let imgUrl = qrCodes[vehicle.id];

    // Se não tiver, gerar o QR Code
    if (!imgUrl) {
      imgUrl = await generateQRCode(vehicle);
      if (!imgUrl) return; // Se falhar ao gerar
    }

    // Criar um link temporário
    const link = document.createElement("a");
    link.href = imgUrl;

    // Formar o nome do arquivo: Nome completo + Placa
    const fileName = `${vehicle.completeName}_${vehicle.licensePlate.replace(
      /[^a-zA-Z0-9]/g,
      ""
    )}.png`;
    link.download = fileName;

    // Adicionar, clicar e remover o link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    try {
      const response = await client.delete(`/vehicles/${id}`);
      setDeleted(response);
    } catch (error) {
      console.log(error);
    }
  };

  if (auth.user.role !== "S2") return <Unauthorized />;

  return (
    <>
      <Navbar />
      <Box
        w="98%"
        margin={"auto"}
        mt={3}
        p={5}
        border="1px solid #ccc"
        borderRadius={15}
        display="flex"
        flexDirection={"column"}
        alignItems="center"
      >
        <Text fontSize={22} pb={5} fontWeight="700" margin="auto">
          Veículos Autorizados por QR Code:
        </Text>
        <Table variant="striped" colorScheme="red" size="sm">
          <Thead>
            <Tr>
              <Th textAlign="center">Nome</Th>
              <Th textAlign="center">P/G Nome Guerra</Th>
              <Th textAlign="center">Carro</Th>
              <Th textAlign="center">Placa</Th>
              <Th textAlign="center">Cor</Th>
              <Th textAlign="center">Habilitação</Th>
              <Th textAlign="center">Idt</Th>
              <Th textAlign="center">Esqd</Th>
              <Th textAlign="center">Seção</Th>
              <Th textAlign="center">QR Code</Th>
              <Th textAlign="center">Editar</Th>
              <Th textAlign="center">Excluir</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data?.map((el) => {
                return (
                  <Tr key={el.id}>
                    <Td>{el.completeName}</Td>
                    <Td>{el.tagName}</Td>
                    <Td textAlign="center">{el.carModel}</Td>
                    <Td textAlign="center">{el.licensePlate}</Td>
                    <Td textAlign="center">{el.color}</Td>
                    <Td textAlign="center">{el.driverLicense}</Td>
                    <Td textAlign="center">{el.idNumber}</Td>
                    <Td textAlign="center">{el.company}</Td>
                    <Td textAlign="center">{el.section}</Td>
                    <Td textAlign="center">
                      <Tooltip label={`Baixar QR Code de ${el.completeName}`}>
                        <Button
                          size={"sm"}
                          colorScheme="green"
                          onClick={() => handleDownloadQRCode(el)}
                        >
                          Download
                        </Button>
                      </Tooltip>
                    </Td>
                    <Td textAlign="center">
                      <a href={`/veiculos/${el.id}`}>
                        <Button size={"sm"} colorScheme="yellow">
                          Editar
                        </Button>
                      </a>
                    </Td>
                    <Td textAlign="center">
                      <Button
                        size={"sm"}
                        colorScheme="red"
                        onClick={() => handleDelete(el.id)}
                      >
                        Excluir
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default ListVehicles;
