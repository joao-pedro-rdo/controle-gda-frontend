import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import client from "../services/client";

const ChangePassword = () => {
  const { register, handleSubmit } = useForm();
  const auth = useAuth();
  const toast = useToast();

  const onSubmit = async (data) => {
    if (data.newPassword !== data.newPasswordAgain)
      return toast({
        title: "Erro",
        description: "Senhas não são iguais",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

    const req = {
      login: auth.user.login,
      oldPass: data.oldPassword,
      newPass: data.newPassword,
    };

    try {
      const response = await client.patch(`/updPass/${auth.user.id}`, req);
      if (response.data.error) {
        return toast({
          title: "Erro",
          description: "Senha antiga não confere",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.log(response);
        return toast({
          title: "Ok",
          description: "Senha alterada com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <Flex justifyContent={"center"}>
        <Flex
          justifyContent={"center"}
          mt={"4rem"}
          p={8}
          border="1px solid #ccc"
          borderRadius={15}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex flexDir={"column"} gap={10}>
              <Text fontSize={28} margin="auto" fontWeight={700}>
                Mudança de Senha
              </Text>
              <Box>
                <FormLabel>Senha antiga:</FormLabel>
                <Input type="password" {...register("oldPassword")} />
              </Box>
              <Box>
                <FormLabel>Nova Senha:</FormLabel>
                <Input type="password" {...register("newPassword")} />
              </Box>
              <Box>
                <FormLabel>Repita a nova senha:</FormLabel>
                <Input type="password" {...register("newPasswordAgain")} />
              </Box>
              <Button type="submit" colorScheme={"green"}>
                Alterar Senha
              </Button>
            </Flex>
          </form>
        </Flex>
      </Flex>
    </>
  );
};

export default ChangePassword;
