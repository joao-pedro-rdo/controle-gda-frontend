import { Box, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DriverForm from "../components/DriverForm";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import client from "../services/client";
import { format } from "date-fns";
import Unauthorized from "../components/Unauthorized";

const Drivers = () => {
  const auth = useAuth();
  const [reload, setReload] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const request = async () => {
      const response = await client.get("/driver");
      const drivers = response.data.sort((a, b) => {
        if (a.expirationDate > b.expirationDate) {
          return 1;
        }
        if (a.expirationDate < b.expirationDate) {
          return -1;
        }
        return 0;
      });
      setDrivers(drivers);
    };
    request();
  }, [reload]);

  const handleDelete = async (id) => {
    await client.delete(`/driver/${id}`);
    setReload(!reload);
  };

  const handleEdit = async (id) => {
    const toEdit = await client.get(`/driver/${id}`);
    setEdit(toEdit.data);
  };

  if (auth.user.role !== "Sta") return <Unauthorized />;

  return (
    <Box display={"flex"} flexDirection="column">
      <Navbar />
      <DriverForm
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
        {drivers &&
          drivers.map((driver) => (
            <Box
              key={driver.id}
              border={
                new Date() > new Date(driver.expirationDate) - 5184000000
                  ? "1px solid red"
                  : "1px solid #ccc"
              }
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
                  Nome:
                </Text>
                <Text textAlign={"right"} fontWeight={700}>
                  N° Registro:
                </Text>
                <Text textAlign={"right"} fontWeight={700}>
                  Categoria:
                </Text>
                <Text textAlign={"right"} fontWeight={700}>
                  Cursos:
                </Text>
                <Text textAlign={"right"} fontWeight={700}>
                  Vencimento:
                </Text>
              </Box>
              <Box w="40%">
                <Text>{driver.name}</Text>
                <Text>{driver.driverLicense}</Text>
                <Text>{driver.category}</Text>
                <Text>{driver.courses || <br></br>}</Text>
                {new Date() > new Date(driver.expirationDate) - 5184000000 ? (
                  <Text color={"red"} fontWeight={700}>
                    {format(new Date(driver.expirationDate), "dd/MM/yyyy")}
                  </Text>
                ) : (
                  <Text color={"teal"}>
                    {format(new Date(driver.expirationDate), "dd/MM/yyyy")}
                  </Text>
                )}
              </Box>
              <Button
                onClick={() => handleEdit(driver.id)}
                colorScheme={"yellow"}
                variant={"outline"}
                mr="5px"
              >
                Alterar
              </Button>
              <Button
                onClick={() => handleDelete(driver.id)}
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

export default Drivers;
