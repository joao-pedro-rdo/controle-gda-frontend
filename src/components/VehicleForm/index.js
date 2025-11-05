import QRCode from "qrcode";
import client from "../../services/client.js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FormLabel,
  Button,
  Image,
  Box,
  Badge,
  Tooltip,
  FormHelperText,
} from "@chakra-ui/react";
import * as S from "./styles.js";

const VehicleForm = () => {
  const [imgUrl, setImgUrl] = useState();
  const { id } = useParams();
  const [toEdit, setToEdit] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (id) {
        const request = async () => {
          const response = await client.get(`/vehicles/${id}`);
          setToEdit(response.data);
        };
        request();
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    if (toEdit?.id) {
      try {
        const request = async () => {
          const edited = await client.get(`/vehicles/${id}`);
          const stringify = `{"licensePlate": ${JSON.stringify(
            edited.data.licensePlate
          )}}`;
          const response = await QRCode.toDataURL(stringify);
          setImgUrl(response);
        };
        request();
      } catch (error) {
        console.log(error);
      }
    }
  }, [toEdit]);

  useEffect(() => {
    if (!imgUrl && toEdit?.id) {
      try {
        const request = async () => {
          const result = await client.get(`/vehicles/${id}`);
          const edited = { licensePlate: result.data.licensePlate };
          const stringify = JSON.stringify(edited);
          const response = await QRCode.toDataURL(stringify);
          setImgUrl(response);
        };
        request();
      } catch (error) {
        console.log(error);
      }
    }
  }, [imgUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setImgUrl(null);
    const formData = new FormData(event.currentTarget);

    const data = {
      completeName: formData.get("completeName"),
      tagName: formData.get("tagName"),
      carModel: formData.get("carModel"),
      licensePlate: formData.get("licensePlate"),
      color: formData.get("color"),
      driverLicense: formData.get("driverLicense"),
      idNumber: formData.get("idNumber"),
      company: formData.get("company"),
      section: formData.get("section"),
    };

    try {
      toEdit?.id
        ? client.patch(`/vehicles/${toEdit.id}`, data)
        : createNew(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createNew = async (data) => {
    const response = await client.post("/vehicles", data);
    navigate(`./${response.data.id}`, { replace: true });
  };

  // Função para realizar o download do QR Code
  const handleDownloadQRCode = () => {
    // Verificar se temos todos os dados necessários
    if (!imgUrl || !toEdit?.completeName || !toEdit?.licensePlate) return;

    // Criar um link temporário
    const link = document.createElement("a");
    link.href = imgUrl;

    // Formar o nome do arquivo: Nome completo + Placa
    const fileName = `${toEdit.completeName}_${toEdit.licensePlate.replace(
      /[^a-zA-Z0-9]/g,
      ""
    )}.png`;
    link.download = fileName;

    // Adicionar, clicar e remover o link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <S.Wrapper>
      <Box w="90%" p={3}>
        <form onSubmit={handleSubmit}>
          <S.StyledFormControl>
            <S.StyledGrid templateColumns="repeat(4, 1fr)" gap={1}>
              <Box w="90%" p={1}>
                <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
                  Dados pessoais
                </Badge>
                <FormLabel htmlFor="completeName">Nome Completo</FormLabel>
                <S.StyledInput
                  type="text"
                  name="completeName"
                  placeholder="Nome completo do militar"
                  pattern="[A-Za-zÀ-ÿ\s]{3,}"
                  title="Nome deve ter pelo menos 3 caracteres"
                  minLength="3"
                  style={{ textTransform: "capitalize" }}
                  defaultValue={toEdit.completeName || ""}
                  required
                />
                <FormLabel htmlFor="tagName">P/G - Nome de Guerra</FormLabel>
                <S.StyledInput
                  type="text"
                  name="tagName"
                  placeholder="Ex: Sgt Silva, Cb Santos"
                  pattern="[A-Za-zÀ-ÿ\s]{2,}"
                  title="Nome de guerra (apenas letras e espaços)"
                  style={{ textTransform: "capitalize" }}
                  defaultValue={toEdit.tagName || ""}
                  required
                />
                <FormLabel htmlFor="driverLicense">Habilitação</FormLabel>
                <S.StyledInput
                  type="text"
                  name="driverLicense"
                  defaultValue={toEdit.driverLicense || ""}
                />
                <FormLabel htmlFor="idNumber">CPF do Militar</FormLabel>
                <S.StyledInput
                  type="text"
                  name="idNumber"
                  placeholder="000.000.000-00"
                  pattern="[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}"
                  title="Digite um CPF válido"
                  maxLength="14"
                  onInput={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 11) {
                      value = value.replace(/(\d{3})(\d)/, "$1.$2");
                      value = value.replace(/(\d{3})(\d)/, "$1.$2");
                      value = value.replace(/(\d{3})(\d{1,2})/, "$1-$2");
                      e.target.value = value;
                    }
                  }}
                  defaultValue={toEdit.idNumber || ""}
                  required
                />
              </Box>

              <Box w="90%" p={1} h="100%">
                <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
                  Dados do veículo
                </Badge>
                <FormLabel htmlFor="carModel">Modelo do veículo</FormLabel>
                <S.StyledInput
                  type="text"
                  name="carModel"
                  required
                  defaultValue={toEdit.carModel || ""}
                />
                <FormLabel htmlFor="licensePlate">Placa do Veículo</FormLabel>
                <S.StyledInput
                  type="text"
                  name="licensePlate"
                  placeholder="ABC-1234 ou ABC1D23"
                  pattern="[A-Z]{3}-?[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2}"
                  title="Digite uma placa brasileira válida"
                  maxLength="8"
                  style={{ textTransform: "uppercase" }}
                  onInput={(e) => {
                    let value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    if (value.length <= 7) {
                      if (
                        value.length === 7 &&
                        /^[A-Z]{3}[0-9]{4}$/.test(value)
                      ) {
                        value = value.replace(/([A-Z]{3})([0-9]{4})/, "$1-$2");
                      }
                      e.target.value = value;
                    }
                  }}
                  defaultValue={toEdit.licensePlate || ""}
                  required
                />
                <FormLabel htmlFor="color">Cor</FormLabel>
                <S.StyledInput
                  type="text"
                  required
                  name="color"
                  defaultValue={toEdit.color || ""}
                />
              </Box>

              <Box w="90%" p={1} h="100%">
                <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
                  Dados da seção
                </Badge>
                <FormLabel htmlFor="company">Esqd</FormLabel>
                <S.StyledInput
                  type="text"
                  name="company"
                  defaultValue={toEdit.company || ""}
                />
                <FormLabel htmlFor="section">Seção</FormLabel>
                <S.StyledInput
                  type="text"
                  name="section"
                  defaultValue={toEdit.section || ""}
                />
              </Box>

              <S.StyledBox w="90%" p={1}>
                <S.QRBox>
                  <Image src={imgUrl || null} alt="" />
                </S.QRBox>

                {/* Container para os botões */}
                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                  {/* Botão de cadastro/edição */}
                  <Button colorScheme="red" type="submit">
                    {toEdit?.id
                      ? "Editar e gerar QR Code"
                      : "Cadastrar e gerar QR Code"}
                  </Button>

                  {/* Botão de download do QR Code sem o ícone */}
                  {imgUrl && toEdit?.id && (
                    <Tooltip
                      label={`Baixar QR Code de ${
                        toEdit.completeName || "Veículo"
                      }`}
                    >
                      <Button
                        onClick={handleDownloadQRCode}
                        colorScheme="green"
                      >
                        Download QR Code
                      </Button>
                    </Tooltip>
                  )}
                </Box>
              </S.StyledBox>
            </S.StyledGrid>
          </S.StyledFormControl>
        </form>
      </Box>
    </S.Wrapper>
  );
};

export default VehicleForm;
