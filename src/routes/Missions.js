import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import client from "../services/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";
import Unauthorized from "../components/Unauthorized";

const Missions = () => {
  const [drivers, setDrivers] = useState(null);
  const [viaturas, setViaturas] = useState(null);
  const [missions, setMissions] = useState(null);
  const [reload, setReload] = useState(false);
  const { handleSubmit, reset, register } = useForm();
  const auth = useAuth();

  useEffect(() => {
    const request = async () => {
      const respDrivers = await client.get("/driver");
      const respViaturas = await client.get("/viaturas");
      const respMissions = await client.get("/missions");
      const unfinishedMissions = respMissions.data.filter(
        (mission) => !mission.finalOdometer
      );

      setDrivers(respDrivers.data);
      setViaturas(respViaturas.data);
      unfinishedMissions[0] && setMissions(unfinishedMissions);
    };
    request();
  }, [reload]);

  const onSubmit = async (data) => {
    const [ano, mes, dia] = data.date.split("-");
    const [hora, minuto] = data.time.split(":");

    const dateMission = new Date(ano, mes, dia, hora, minuto, 0, 0);

    const newMission = {
      viaturaId: +data.viaturaId,
      driverId: +data.driverId,
      complements: data.complements,
      dateMission,
      destination: data.destination,
    };

    try {
      await client.post("/missions", newMission);
      reset();
      setReload(!reload);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    await client.delete(`/missions/${id}`);
    setMissions(missions.filter((mission) => mission.id !== id));
    setReload(!reload);
  };

  if (auth.user.role !== "Sta") return <Unauthorized />;

  return (
    <>
      <Navbar />
      <Box
        justifyContent={"center"}
        alignItems={"center"}
        display="flex"
        flexDirection="column"
      >
        <Box
          display={"flex"}
          mt={10}
          w="90%"
          border={"1px solid #ccc"}
          borderRadius={10}
        >
          <Box w="100%" p={5}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex flexDirection={"column"}>
                <Box
                  display={"flex"}
                  alignItems="center"
                  justifyContent={"space-evenly"}
                  w="100%"
                  mb={4}
                >
                  <FormLabel>
                    Motorista:
                    <Select minW={250} {...register("driverId")}>
                      <option selected value="#">
                        Selecione Motorista
                      </option>
                      {drivers &&
                        drivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name}
                          </option>
                        ))}
                    </Select>
                  </FormLabel>
                  <FormLabel>
                    Viatura:
                    <Select minW={250} {...register("viaturaId")}>
                      <option selected value="#">
                        Selecione Viatura
                      </option>
                      {viaturas &&
                        viaturas.map((viatura) => (
                          <option key={viatura.id} value={viatura.id}>
                            {`${viatura.model} - ${viatura.licensePlate}`}
                          </option>
                        ))}
                    </Select>
                  </FormLabel>
                  <FormLabel>
                    Data da missão:
                    <Input type="date" name="date" {...register("date")} />
                  </FormLabel>
                  <FormLabel>
                    Hora da missão:
                    <Input type="time" name="time" {...register("time")} />
                  </FormLabel>
                </Box>
                <Box w="86%" m={"auto"}>
                  <FormLabel>
                    Missão:
                    <Textarea {...register("complements")} />
                  </FormLabel>
                  <FormLabel>
                    Destino:
                    <Input
                      type="text"
                      name="destino"
                      {...register("destination")}
                    />
                  </FormLabel>
                </Box>
                <Button type="submit" colorScheme={"red"} m="auto">
                  Enviar
                </Button>
              </Flex>
            </form>
          </Box>
        </Box>
        <Box w={"90%"}>
          {missions &&
            missions.map((mission) => (
              <Box
                key={mission.id}
                border={"1px solid #ccc"}
                w="100%"
                borderRadius={10}
                padding="0.8rem"
                display={"flex"}
                justifyContent="space-between"
                alignItems="center"
                mt={10}
              >
                <Box w="10%">
                  <Text textAlign={"right"} fontWeight={700}>
                    Missão:
                  </Text>
                  <Text textAlign={"right"} fontWeight={700}>
                    Motorista:
                  </Text>
                  <Text textAlign={"right"} fontWeight={700}>
                    Data - Hora:
                  </Text>
                  <Text textAlign={"right"} fontWeight={700}>
                    Viatura:
                  </Text>
                  <Text textAlign={"right"} fontWeight={700}>
                    Destino:
                  </Text>
                  <Text textAlign={"right"} fontWeight={700}>
                    Autorizada:
                  </Text>
                </Box>
                <Box w="70%">
                  <Text>{mission.complements}</Text>
                  <Text>{mission.driver.name}</Text>
                  <Text>
                    {format(
                      new Date(mission.dateMission),
                      "dd MMM yyyy - HH:mm",
                      { locale: ptBR }
                    )}
                  </Text>
                  <Text>{mission?.viatura.model}</Text>
                  <Text>{mission?.destination || <br></br>}</Text>
                  <Text>
                    {mission.isAuthorized ? "Autorizada" : "Não autorizada"}
                  </Text>
                </Box>
                {/* <Button
                  onClick={() => handleEdit(mission.id)}
                  colorScheme={"yellow"}
                  variant={"outline"}
                  mr="5px"
                >
                  Alterar
                </Button> */}
                <Button
                  onClick={() => handleDelete(mission.id)}
                  colorScheme={"red"}
                  variant={"outline"}
                >
                  Excluir
                </Button>
              </Box>
            ))}
        </Box>
      </Box>
    </>
  );
};

export default Missions;
