import client from "../../services/client.js";
import { FormLabel, Button, Box, Badge, Flex } from "@chakra-ui/react";
import * as S from "./styles.js";
import { useForm } from "react-hook-form";

const ViaturaForm = ({ reload, setReload, edit, setEdit }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    if (edit) {
      try {
        const newData = {
          model: data.model || edit.model,
          licensePlate: data.licensePlate || edit.licensePlate,
          complements: data.complements || edit.complements,
        };

        await client.patch(`/viaturas/${edit.id}`, newData);
        setEdit(null);
        reset();
        setReload(!reload);
      } catch (error) { }
    } else {
      try {
        await client.post("/viaturas", data);
        reset();
        setReload(!reload);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const cleanForm = () => {
    reset();
    setEdit(null);
  };

  return (
    <S.Wrapper>
      <Box w="90%" p={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <S.StyledFormControl>
            <Box w="90%" p={1}>
              <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
                Dados da viatura
              </Badge>
              <Box
                w="100%"
                alignItems={"center"}
                justifyContent="space-between"
                display="flex"
                flexDirection={"row"}
              >
                <Box display={"flex"} alignItems="center">
                  <FormLabel htmlFor="model">Modelo:</FormLabel>
                  <S.StyledInput
                    {...register("model")}
                    defaultValue={edit ? edit.model : ""}
                    type="text"
                    name="model"
                    id="model"
                  />
                </Box>

                <Box display={"flex"} alignItems="center">
                  <FormLabel htmlFor="licensePlate">Placa / EB:</FormLabel>
                  <S.StyledInput
                    {...register("licensePlate")}
                    defaultValue={edit ? edit.licensePlate : ""}
                    type="text"
                    name="licensePlate"
                    id="licensePlate"
                  />
                </Box>

                <Box display={"flex"} alignItems="center">
                  <FormLabel htmlFor="complements">Complemento:</FormLabel>
                  <S.StyledInput
                    {...register("complements")}
                    defaultValue={edit ? edit.complements : ""}
                    type="text"
                    name="complements"
                    id="complements"
                  />
                </Box>
              </Box>
            </Box>

            <S.StyledBox w="90%" p={1}>
              <Flex gap="2rem">
                <Button colorScheme={edit ? "yellow" : "red"} type="submit">
                  {edit ? "Alterar" : "Cadastrar"}
                </Button>
                <Button
                  colorScheme={"red"}
                  variant="outline"
                  onClick={cleanForm}
                >
                  Limpar
                </Button>
              </Flex>
            </S.StyledBox>
          </S.StyledFormControl>
        </form>
      </Box>
    </S.Wrapper>
  );
};

export default ViaturaForm;
