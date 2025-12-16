import { Badge, Box, Button, Input, Select, Text, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import { useAuth } from "../context/AuthContext";
import client from "../services/client";

const Users = () => {
  const auth = useAuth();
  const [data, setData] = useState();
  const [deleted, setDeleted] = useState(null);
  const [reload, setReload] = useState(false);
  const [isMd] = useMediaQuery("(min-width: 800px)");

  useEffect(() => {
    const request = async () => {
      const response = await client.get("/users");
      if (response?.data) {
        setData(response.data);
      }
    };
    request();
  }, [deleted, reload]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const login = event.target.newLogin.value;
    const password = event.target.newPassword.value;
    const role = event.target.role.value;

    const newUser = { login, password, role };
    try {
      await client.post("/signup", newUser);
      setReload(!reload);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/deleteUser/${id}`);
      setReload(!reload);
    } catch (error) {
      console.log(error);
    }
  };

  if (auth.user.role !== "S2") {
    return <Unauthorized />;
  }

  return (
    <section className="flex flex-col gap-4">
      <Navbar />

      <article className={`${isMd ? "w-[70%]" : "w-[80%]"} flex h-auto self-center rounded-xl justify-center border-2`}>
        <Box w="100%" p={3}>
          <form onSubmit={handleSubmit} className="w-[100%]">
            <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
              Cadastrar Usuário
            </Badge>
            <Box 
              className={`${isMd ? "flex justify-between gap-4" : "flex flex-col gap-4"}`}
            >
              <label htmlFor="login">
                Login: <Input className="w-[90%] mb-4" type="text" name="newLogin" />
              </label>
              <label htmlFor="password">
                Senha: <Input className="w-[90%] mb-4" type="password" name="newPassword" />
              </label>
              <label htmlFor="role">
                Permissões:{" "}
                <Select name="role">
                  <option value="S2">S2</option>
                  <option value="Guarda">Guarda</option>
                  <option value="RP">RP</option>
                  <option value="Sta">Sta</option>
                  <option value="SFPC">SFPC</option>
                  <option value="Ofdia">Oficial de Dia</option>
                  <option value="Scmt">Sub-Comandante</option>
                  <option value="Fiscal">Fiscal Adm</option>
                </Select>
              </label>

              <Button colorScheme="red" type="submit" className="self-center">
                Cadastrar
              </Button>
            </Box>
          </form>
        </Box>
      </article>

      <article className={`${isMd ? "w-[70%]" : "w-[80%]"} flex h-auto self-center rounded-xl justify-center border-2`}>
        {data &&
          data.map((user) => {
            return (
              <article className="flex justify-between w-[100%] p-2" key={user.id}>
                <Text className="flex w-full p-2 gap-2" textAlign="center">
                  <strong>Usuário: </strong>
                  <p>{user.login}</p>
                </Text>
                <Text className="flex w-full p-2 gap-2" textAlign="center">
                  <strong>Permissão: </strong>
                  <p>{user.role}</p>
                </Text>
                {auth.user.login !== user.login ? (
                  <Button
                    onClick={() => handleDelete(user.id)}
                    colorScheme={"red"}
                  >
                    Excluir
                  </Button>
                ) : (
                  <Box minW={20}></Box>
                )}
              </article>
            );
          })}
      </article>
    </section>
  );
};

export default Users;
