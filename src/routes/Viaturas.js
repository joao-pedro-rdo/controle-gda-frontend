import { Box, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import client from "../services/client";
import ViaturaForm from "../components/ViaturaForm";
import Unauthorized from "../components/Unauthorized";

const Viaturas = () => {
  const auth = useAuth();
  const [reload, setReload] = useState(false);
  const [viaturas, setViaturas] = useState([]);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const request = async () => {
      const response = await client.get("/viaturas");
      const viaturas = response.data.sort((a, b) => {
        if (a.licensePlate > b.licensePlate) {
          return 1;
        }
        if (a.licensePlate < b.licensePlate) {
          return -1;
        }
        return 0;
      });

      setViaturas(viaturas);
    };
    request();
  }, [reload]);

  const handleDelete = async (id) => {
    await client.delete(`/viaturas/${id}`);
    setReload(!reload);
  };

  const handleEdit = async (id) => {
    const toEdit = await client.get(`/viaturas/${id}`);
    setEdit(toEdit.data);
  };

  if (auth.user.role !== "Sta") return <Unauthorized />;

  return (
    <Box display={"flex"} flexDirection="column">
      <Navbar />
      <ViaturaForm
        setReload={setReload}
        reload={reload}
        edit={edit}
        setEdit={setEdit}
      />
      <Box
        display={"flex"}
        w="90%"
        margin={"auto"}
        gap="1rem"
        pt={10}
        justifyContent="center"
        flexWrap={"wrap"}
      >
        {viaturas &&
          viaturas.map((viatura) => (
            <Box
              key={viatura.id}
              border={"1px solid #ccc"}
              w="30%"
              minW={"500px"}
              borderRadius={10}
              padding="0.8rem"
              display={"flex"}
              justifyContent="space-between"
              alignItems="center"
            >
              <Box w="30%">
                <Text textAlign={"right"} fontWeight={700}>
                  Modelo:
                </Text>
                <Text textAlign={"right"} fontWeight={700}>
                  Placa/EB:
                </Text>
                <Text textAlign={"right"} fontWeight={700}>
                  Complementos:
                </Text>
              </Box>
              <Box w="40%">
                <Text>{viatura.model}</Text>
                <Text>{viatura.licensePlate}</Text>
                <Text>{viatura.complements}</Text>
              </Box>
              <Button
                onClick={() => handleEdit(viatura.id)}
                colorScheme={"yellow"}
                variant={"outline"}
                mr="5px"
              >
                Alterar
              </Button>
              <Button
                onClick={() => handleDelete(viatura.id)}
                colorScheme={"red"}
                variant={"outline"}
              >
                Excluir
              </Button>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default Viaturas;
