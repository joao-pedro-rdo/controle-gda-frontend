import client from "../../services/client.js";
import { FormLabel, Button, Box, Badge, Flex, Select } from "@chakra-ui/react";
import * as S from "./styles.js";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

const DriverForm = ({ reload, setReload, edit, setEdit }) => {
  const { register, handleSubmit, reset } = useForm();

  if (edit) {
    var expirationDate = format(new Date(edit.expirationDate), "yyyy-MM-dd");
  }

  const onSubmit = async (data) => {
    const expirationDate = new Date(data.expirationDate || edit.expirationDate);
    expirationDate.setHours(expirationDate.getHours() + 3);
    const courses = data?.courses || edit?.courses;
    const newData = {
      name: data.name || edit.name,
      driverLicense: data.driverLicense || edit.driverLicense,
      expirationDate,
      category: data.category || edit.category,
      courses,
    };

    if (edit) {
      try {
        await client.patch(`/driver/${edit.id}`, newData);
        reset();
        setEdit(null);
        setReload(!reload);
      } catch (error) { }
    } else {
      try {
        await client.post("/driver", newData);
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
                Dados pessoais
              </Badge>
              <Box
                w="100%"
                alignItems={"center"}
                justifyContent="space-between"
                display="flex"
                flexDirection={"row"}
                gap={5}
              >
                <Box display={"flex"} alignItems="center">
                  <FormLabel htmlFor="name">Nome:</FormLabel>
                  <S.StyledInput
                    {...register("name")}
                    defaultValue={edit ? edit.name : ""}
                    type="text"
                    name="name"
                  />
                </Box>

                <Box display={"flex"} alignItems="center">
                  <FormLabel htmlFor="driverLicense">N° Registro:</FormLabel>
                  <S.StyledInput
                    {...register("driverLicense")}
                    defaultValue={edit ? edit.driverLicense : ""}
                    type="text"
                    name="driverLicense"
                  />
                </Box>
                <Box display={"flex"} alignItems="center">
                  <FormLabel htmlFor="expirationDate">
                    Validade Habilitação:
                  </FormLabel>
                  <S.StyledInput
                    {...register("expirationDate")}
                    defaultValue={edit ? expirationDate : ""}
                    type="date"
                    name="expirationDate"
                  />
                </Box>
              </Box>
              <Box display={"flex"} alignItems="center" gap={16}>
                <FormLabel htmlFor="courses">Cursos:</FormLabel>
                <S.StyledInput
                  {...register("courses")}
                  defaultValue={edit ? edit.courses : ""}
                  type="text"
                  name="courses"
                />
                <FormLabel htmlFor="category">Categoria:</FormLabel>
                <Select {...register("category")}>
                  <option disabled selected>
                    Selecione a categoria
                  </option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </Select>
                {/* <S.StyledInput
                  {...register("category")}
                  defaultValue={edit ? edit.category : ""}
                  type="text"
                  name="category"
                /> */}
              </Box>
            </Box>

            <S.StyledBox w="90%" p={1}>
              <Flex gap="2rem">
                <Button colorScheme={edit ? "yellow" : "blue"} type="submit">
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

export default DriverForm;
