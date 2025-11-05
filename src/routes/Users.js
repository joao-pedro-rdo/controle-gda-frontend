import { Badge, Box, Button, Input, Select, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import { useAuth } from "../context/AuthContext";
import client from "../services/client";

const Users = () => {
  const auth = useAuth();
  const [data, setData] = useState();
  const [deleted, setDeleted] = useState(null);
  const [reload, setReload] = useState(false);

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
    <>
      <Navbar />
      <Wrapper>
        <Box w="90%" p={3}>
          <form onSubmit={handleSubmit}>
            <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
              Cadastrar Usuário
            </Badge>
            <Box display={"flex"} justifyContent={"space-between"}>
              <label htmlFor="login">
                Login: <StyledInput type="text" name="newLogin" />
              </label>
              <label htmlFor="password">
                Senha: <StyledInput type="password" name="newPassword" />
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

              <Button colorScheme="red" type="submit">
                Cadastrar
              </Button>
            </Box>
          </form>
        </Box>
      </Wrapper>

      <Wrapper>
        {data &&
          data.map((user) => {
            return (
              <Card key={user.id}>
                <Text w={"30%"} textAlign="center">
                  <strong>Usuário: </strong>
                  <p>{user.login}</p>
                </Text>
                <Text w={"30%"} textAlign="center">
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
              </Card>
            );
          })}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  border: 1px solid #ccc;
  display: flex;
  justify-content: space-evenly;
  width: 90%;
  margin: auto;
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 1rem;
  background-color: white;
  flex-wrap: wrap;
`;

export const StyledInput = styled(Input)`
  width: 90%;
  margin-bottom: 1rem;
`;

const Card = styled.div`
  padding: 0.7rem;
  border: 1px solid #ccc;
  margin: 0.7rem;
  border-radius: 1rem;
  display: flex;
  min-width: 500px;
  justify-content: space-between;
  align-items: center;
`;

export default Users;
