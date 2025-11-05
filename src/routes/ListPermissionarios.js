import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
} from "@chakra-ui/react";
import QRCode from "qrcode";
import client from "../services/client";
import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import AuthenticatedImage from "../components/AuthenticatedImage";
import { useAuth } from "../context/AuthContext";

const ListPermissionarios = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [permissionarios, setPermissionarios] = useState([]);
  const [deleted, setDeleted] = useState(null);
  const [qrCodes, setQrCodes] = useState({});

  useEffect(() => {
    const fetchPermissionarios = async () => {
      try {
        const response = await client.get("/permissionarios");
        setPermissionarios(
          response.data.sort((a, b) => {
            if (a.completeName < b.completeName) return -1;
            return 0;
          })
        );
      } catch (error) {
        console.error("Erro ao buscar permissionários:", error);
      }
    };

    fetchPermissionarios();
  }, [deleted, auth.user.role]);

  // Gerar o QR Code para um permissionário específico
  const generateQRCode = async (permissionario) => {
    try {
      const stringify = `{"permissionario": ${JSON.stringify(
        permissionario.CPF
      )}}`;
      const response = await QRCode.toDataURL(stringify);
      setQrCodes((prev) => ({
        ...prev,
        [permissionario.id]: response,
      }));
      return response;
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      return null;
    }
  };

  // Função para realizar o download do QR Code
  const handleDownloadQRCode = async (permissionario) => {
    let imgUrl = qrCodes[permissionario.id];

    if (!imgUrl) {
      imgUrl = await generateQRCode(permissionario);
      if (!imgUrl) return;
    }

    const link = document.createElement("a");
    link.href = imgUrl;
    const fileName = `${permissionario.completeName}_${permissionario.CPF}.png`;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (id) => {
    navigate(`/permissionarios?id=${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await client.delete(`/permissionarios/${id}`);
      setDeleted(response);
    } catch (error) {
      console.error("Erro ao excluir permissionário:", error);
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
          Permissionários Cadastrados
        </Text>
        <Button
          colorScheme="blue"
          mb={4}
          onClick={() => navigate("/permissionarios")}
        >
          Novo Permissionário
        </Button>
        <Table variant="striped" colorScheme="gray" size="sm">
          <Thead>
            <Tr>
              <Th textAlign="center">Foto</Th>
              <Th textAlign="center">Nome Completo</Th>
              <Th textAlign="center">Identidade</Th>
              <Th textAlign="center">CPF</Th>
              <Th textAlign="center">Local</Th>
              <Th textAlign="center">Veículo</Th>
              <Th textAlign="center">Placa</Th>
              <Th textAlign="center">Cor</Th>
              <Th textAlign="center">QR Code</Th>
              <Th textAlign="center">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {permissionarios.map((p) => (
              <Tr key={p.id}>
                <Td textAlign="center">
                  {p.imagePath ? (
                    <AuthenticatedImage
                      imagePath={p.imagePath}
                      alt={p.completeName}
                      boxSize="60px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  ) : (
                    <Box
                      boxSize="60px"
                      bg="gray.200"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="xs"
                      color="gray.500"
                    >
                      Sem foto
                    </Box>
                  )}
                </Td>
                <Td textAlign="center">{p.completeName}</Td>
                <Td textAlign="center">{p.idNumber}</Td>
                <Td textAlign="center">{p.CPF}</Td>
                <Td textAlign="center">{p.local || "N/A"}</Td>
                <Td textAlign="center">{p.carModel || "N/A"}</Td>
                <Td textAlign="center">{p.licensePlate || "N/A"}</Td>
                <Td textAlign="center">{p.color || "N/A"}</Td>
                <Td textAlign="center">
                  {qrCodes[p.id] ? (
                    <Image
                      src={qrCodes[p.id]}
                      alt="QR Code"
                      boxSize="50px"
                      cursor="pointer"
                      onClick={() => handleDownloadQRCode(p)}
                      title="Clique para baixar o QR Code"
                    />
                  ) : (
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() => generateQRCode(p)}
                    >
                      Gerar QR
                    </Button>
                  )}
                </Td>
                <Td textAlign="center">
                  <Button
                    size="sm"
                    colorScheme="yellow"
                    mr={2}
                    onClick={() => handleEdit(p.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(p.id)}
                  >
                    Excluir
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default ListPermissionarios;
