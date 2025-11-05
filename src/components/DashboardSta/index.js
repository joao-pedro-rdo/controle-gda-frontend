import {
  Box,
  Button,
  Image,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import client from "../../services/client";
import QRCode from "qrcode";

const DashboardSta = ({ filterActive = true }) => {
  const [missions, setMissions] = useState();
  const [reload, setReload] = useState(false);
  const auth = useAuth();
  const [qrcode, setQrcode] = useState();

  useEffect(() => {
    const request = async () => {
      const response = await client.get("/missions");
      const unfinishedMissions = response.data.filter(
        (mission) => !mission.finalOdometer
      );
      unfinishedMissions[0] && setMissions(unfinishedMissions);
    };
    request();
  }, [reload]);

  const handleAuthorization = async (id) => {
    try {
      await client.patch(`/authorizeMission/${id}`, {
        isAuthorized: true,
      });
      setReload(!reload);
    } catch (error) {}
  };

  const handleActive = async (id) => {
    try {
      await client.patch(`/deactivateMission/${id}`, {
        isActive: false,
      });
      setReload(!reload);
    } catch (error) {}
  };

  const handleQRCode = async (mission) => {
    const code = {
      mission: mission.id,
      viatura: mission.viaturaId,
      motorista: mission.driverId,
    };
    const qrCode = JSON.stringify(code);

    try {
      const link = await QRCode.toDataURL(qrCode);
      setQrcode(link);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      w={"90%"}
      margin="auto"
      pt={8}
      display="flex"
      flexDirection={"column"}
      gap="2rem"
    >
      {qrcode && (
        <Box
          display={"flex"}
          justifyContent="center"
          alignItems={"center"}
          gap="3rem"
        >
          <Image src={qrcode} />
          <Button onClick={() => setQrcode(null)} colorScheme={"yellow"}>
            Limpar
          </Button>
        </Box>
      )}
      {missions &&
        missions.map((mission) => (
          <Box
            key={mission.id}
            display={
              filterActive
                ? mission.isActive
                  ? "flex"
                  : "none"
                : mission.isActive
                ? "none"
                : "flex"
            }
            bgColor={"white"}
            p="1rem"
            border={mission.isAuthorized ? "2px solid green" : "2px solid red"}
            borderRadius={8}
          >
            <Table variant={"striped"}>
              <Thead>
                <Tr>
                  <Th w="65%">Missão</Th>
                  <Th>Viatura</Th>
                  <Th>Motorista</Th>
                  <Th>Horário</Th>
                  <Th>{auth.user.role === "Fiscal" ? "Autorizar" : ""}</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{mission.complements}</Td>
                  <Td>{mission.viatura.model}</Td>
                  <Td>{mission.driver.name}</Td>
                  <Td>
                    {format(new Date(mission.dateMission), "dd-MM-yyyy hh:mm")}
                  </Td>
                  <Td>
                    {auth.user.role === "Fiscal" && !mission.isAuthorized ? (
                      <Button
                        onClick={() => handleAuthorization(mission.id)}
                        colorScheme={"green"}
                      >
                        Autorizar
                      </Button>
                    ) : mission.isAuthorized ? (
                      auth.user.role === "Sta" ? (
                        <Button
                          colorScheme={"red"}
                          onClick={() => handleQRCode(mission)}
                        >
                          QR Code
                        </Button>
                      ) : (
                        "Autorizado"
                      )
                    ) : (
                      ""
                    )}
                  </Td>
                  {auth.user.role === "Sta" && (
                    <Td>
                      <Button
                        onClick={() => handleActive(mission.id)}
                        colorScheme={"red"}
                      >
                        Desativar
                      </Button>
                    </Td>
                  )}
                </Tr>
              </Tbody>
            </Table>
          </Box>
        ))}
    </Box>
  );
};

export default DashboardSta;
