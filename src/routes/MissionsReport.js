import {
  Box,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import { useAuth } from "../context/AuthContext";
import client from "../services/client";

const MissionsReport = () => {
  const [missions, setMissions] = useState();
  const [filtered, setFiltered] = useState(null);
  const [filt, setFilt] = useState("Todas");
  const auth = useAuth();

  useEffect(() => {
    const request = async () => {
      const response = await client.get("/missions");
      setMissions(
        response.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
    };
    request();
  }, []);

  const handleChange = (filter) => {
    setFilt(filter);
    filter === "Encerradas"
      ? setFiltered(
          missions
            .filter((mission) => mission.finalOdometer)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        )
      : filter === "Abertas"
      ? setFiltered(
          missions
            .filter((mission) => !mission.finalOdometer)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        )
      : setFiltered(missions);
  };

  if (
    auth.user.role !== "Sta" &&
    auth.user.role !== "S2" &&
    auth.user.role !== "Scmt" &&
    auth.user.role !== "Fiscal"
  )
    return <Unauthorized />;

  return (
    <>
      <Navbar />
      <SBox>
        <Box
          w={"90%"}
          p={8}
          border="1px solid #ccc"
          borderRadius={10}
          margin="auto"
          mb={8}
        >
          <RadioGroup onChange={handleChange}>
            <Stack direction={"row"} gap={12}>
              <Radio value={"Abertas"}>Fichas Abertas</Radio>
              <Radio value={"Encerradas"}>Fichas Encerradas</Radio>
              <Radio value={"Todas"}>Todas</Radio>
            </Stack>
          </RadioGroup>
        </Box>
      </SBox>
      <Text></Text>
      <SText
        margin="auto"
        w="100%"
        textAlign={"center"}
        fontSize={"28px"}
        fontWeight={700}
      >
        Relatório de Missões: {filt}
      </SText>
      <OtherBox
        w={"90%"}
        p={8}
        border="1px solid #ccc"
        borderRadius={10}
        margin="auto"
      >
        <STable size="sm" variant="striped" colorScheme="linkedin">
          <Thead>
            <Tr>
              <Th>Motorista</Th>
              <Th>Chefe de viatura</Th>
              <Th>Viatura</Th>
              <Th>Missão</Th>
              <Th>Destino</Th>
              <Th>Data de saída</Th>
              <Th>Completada em</Th>
              <Th>Od. saída</Th>
              <Th>Od. chegada</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered &&
              filtered.map((mission) => {
                return (
                  <STr key={mission.id}>
                    <Td>{mission.driver.name}</Td>
                    <Td>{mission.chefeVtr}</Td>
                    <Td>{mission.viatura.model}</Td>
                    <Td>{mission.complements}</Td>
                    <Td>{mission.destination}</Td>
                    <Td>
                      {format(new Date(mission.dateMission), "dd/MM/yyyy")}
                    </Td>
                    <Td>
                      {mission.finalOdometer &&
                        format(new Date(mission.updatedAt), "dd/MM/yyyy HH:mm")}
                    </Td>
                    <Td>{mission.initialOdometer}</Td>
                    <Td>{mission.finalOdometer}</Td>
                  </STr>
                );
              })}
          </Tbody>
        </STable>
      </OtherBox>
    </>
  );
};

export const SBox = styled(Box)`
  @media print {
    display: none;
  }
`;

export const OtherBox = styled(Box)`
  @media print {
    border: none;
  }
`;

export const STable = styled(Table)`
  @media print {
    border: 2px solid black;
  }
`;

export const STr = styled(Tr)`
  @media print {
    border-top: 2px solid black;
  }
`;

export const SText = styled(Text)`
  display: none;

  @media print {
    display: block;
  }
`;
export default MissionsReport;
