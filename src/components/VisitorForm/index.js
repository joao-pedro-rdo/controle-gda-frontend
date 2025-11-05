import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  FormLabel,
  Button,
  Box,
  Badge,
  Select,
  Alert,
  AlertIcon,
  Flex,
  Text,
  Image,
  VStack,
  HStack,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { FaSearch, FaExclamationTriangle } from "react-icons/fa";
import * as S from "./styles.js";
import client from "../../services/client.js";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import InputMask from "react-input-mask";
import ImageCapture from "../ImageCapture";

const VisitorForm = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formatedPhone, setFormatedPhone] = useState();
  const [search] = useSearchParams();
  const [imageBase64, setImageBase64] = useState(null);
  const [scheduledVisitor, setScheduledVisitor] = useState(null);
  const [pessoasNaoAutorizadas, setPessoasNaoAutorizadas] = useState([]);
  const [filteredPessoas, setFilteredPessoas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Buscar pessoas não autorizadas (apenas para Guarda)
  useEffect(() => {
    if (auth.user.role === "Guarda") {
      loadPessoasNaoAutorizadas();
    }
  }, [auth.user.role]);

  // Filtrar pessoas não autorizadas com base na busca
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPessoas(pessoasNaoAutorizadas);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const searchNumbers = searchTerm.replace(/\D/g, ""); // Remove tudo que não é número

      const filtered = pessoasNaoAutorizadas.filter((pessoa) => {
        const nomeMatch = pessoa.nome?.toLowerCase().includes(searchLower);
        const cpfNumbers = pessoa.CPF?.replace(/\D/g, ""); // Remove formatação do CPF
        const cpfMatch =
          searchNumbers && cpfNumbers && cpfNumbers.includes(searchNumbers);
        const identidadeMatch = pessoa.identidade
          ?.toLowerCase()
          .includes(searchLower);

        return nomeMatch || cpfMatch || identidadeMatch;
      });

      setFilteredPessoas(filtered);
    }
  }, [searchTerm, pessoasNaoAutorizadas]);

  const loadPessoasNaoAutorizadas = async () => {
    try {
      setLoading(true);
      console.log("🔍 Carregando pessoas não autorizadas...");
      const response = await client.get("/pessoas-nao-autorizadas");
      console.log("📋 Pessoas não autorizadas carregadas:", response.data);
      setPessoasNaoAutorizadas(response.data);
      setFilteredPessoas(response.data);
    } catch (error) {
      console.error("❌ Erro ao carregar pessoas não autorizadas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Verificar se há dados de agendamento
  useEffect(() => {
    if (location.state?.scheduledVisitor) {
      setScheduledVisitor(location.state.scheduledVisitor);

      // Preencher formulário com dados do agendamento
      setTimeout(() => {
        if (document.querySelector('input[name="completeName"]')) {
          document.querySelector('input[name="completeName"]').value =
            location.state.scheduledVisitor.name || "";
          document.querySelector('input[name="idNumber"]').value =
            location.state.scheduledVisitor.idNumber || "";
          document.querySelector('input[name="phoneNumber"]').value =
            location.state.scheduledVisitor.phoneNumber || "";
          document.querySelector('input[name="carModel"]').value =
            location.state.scheduledVisitor.carModel || "";
          document.querySelector('input[name="licensePlate"]').value =
            location.state.scheduledVisitor.licensePlate || "";
          document.querySelector('input[name="color"]').value =
            location.state.scheduledVisitor.color || "";
          document.querySelector('input[name="contactPerson"]').value =
            location.state.scheduledVisitor.contactPerson || "";

          const sectionSelect = document.querySelector(
            'select[name="section"]'
          );
          if (sectionSelect && location.state.scheduledVisitor.target) {
            sectionSelect.value = location.state.scheduledVisitor.target;
          }
        }
      }, 100);
    }
  }, [location.state]);

  // Função para verificar se a pessoa está restrita
  const verificarPessoaRestrita = (nomeVisitante, cpfVisitante) => {
    if (!nomeVisitante && !cpfVisitante) {
      return null; // Se não tem nome nem CPF, não pode verificar
    }

    // Normalizar dados para comparação
    const nomeNormalizado = nomeVisitante
      ? nomeVisitante.toLowerCase().trim()
      : "";
    const cpfNormalizado = cpfVisitante ? cpfVisitante.replace(/\D/g, "") : "";

    console.log("🔍 Verificando pessoa:", { nomeNormalizado, cpfNormalizado });
    console.log("📋 Lista de pessoas não autorizadas:", pessoasNaoAutorizadas);

    // Buscar na lista de pessoas não autorizadas
    const pessoaRestrita = pessoasNaoAutorizadas.find((pessoa) => {
      const nomeListaNormalizado = pessoa.nome
        ? pessoa.nome.toLowerCase().trim()
        : "";
      const cpfListaNormalizado = pessoa.CPF
        ? pessoa.CPF.replace(/\D/g, "")
        : "";

      // Verificação por nome completo (deve ser exatamente igual)
      const nomeMatch =
        nomeNormalizado &&
        nomeListaNormalizado &&
        nomeNormalizado === nomeListaNormalizado;

      // Verificação por CPF completo (deve ser exatamente igual)
      const cpfMatch =
        cpfNormalizado &&
        cpfListaNormalizado &&
        cpfNormalizado === cpfListaNormalizado;

      console.log("🔍 Comparando com:", {
        pessoa: pessoa.nome,
        nomeMatch,
        cpfMatch,
        nomeListaNormalizado,
        cpfListaNormalizado,
      });

      return nomeMatch || cpfMatch;
    });

    if (pessoaRestrita) {
      console.log("🚫 Pessoa encontrada na lista restrita:", pessoaRestrita);
    } else {
      console.log("✅ Pessoa não encontrada na lista restrita");
    }

    return pessoaRestrita;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = new URLSearchParams(location.search);
    const entryType = search.get("type") || "Entrada";

    // Obter dados do formulário
    const nomeVisitante = formData.get("completeName");
    const cpfVisitante = formData.get("idNumber");

    console.log("📝 Dados do formulário:", { nomeVisitante, cpfVisitante });

    // Verificar se a pessoa está na lista de não autorizadas (apenas se for Guarda)
    if (auth.user.role === "Guarda" && pessoasNaoAutorizadas.length > 0) {
      const pessoaRestrita = verificarPessoaRestrita(
        nomeVisitante,
        cpfVisitante
      );

      if (pessoaRestrita) {
        alert(
          `🚫 ENTRADA NEGADA!\n\n` +
            `Esta pessoa está na lista de NÃO AUTORIZADAS:\n\n` +
            `Nome: ${pessoaRestrita.nome}\n` +
            `CPF: ${pessoaRestrita.CPF}\n` +
            `${
              pessoaRestrita.identidade
                ? `Identidade: ${pessoaRestrita.identidade}\n`
                : ""
            }` +
            `${
              pessoaRestrita.observacao
                ? `Observação: ${pessoaRestrita.observacao}\n`
                : ""
            }\n` +
            `❌ ACESSO NEGADO!`
        );
        return; // Interrompe o processo
      }
    }
    // 🔧 CRIAR FormData para multipart
    const submitData = new FormData();

    // Adicionar campos de texto
    submitData.append("isVisitor", "true");
    submitData.append("name", nomeVisitante || "");
    submitData.append("idNumber", cpfVisitante || "");
    submitData.append("phoneNumber", formData.get("phoneNumber") || "");
    submitData.append("licensePlate", formData.get("licensePlate") || "");
    submitData.append("carModel", formData.get("carModel") || "");
    submitData.append("color", formData.get("color") || "");
    submitData.append("contactPerson", formData.get("contactPerson") || "");
    submitData.append("target", formData.get("section") || "");
    submitData.append("type", entryType);

    // 🖼️ ADICIONAR IMAGEM como arquivo (não base64)
    if (imageBase64) {
      try {
        // Converter base64 para blob
        const base64Data = imageBase64.split(",")[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });

        submitData.append("image", blob, "visitor.jpg");
        console.log("🖼️ Imagem adicionada ao FormData");
      } catch (error) {
        console.error("❌ Erro ao processar imagem:", error);
      }
    }

    console.log("📤 Enviando dados multipart...");

    try {
      // Se for confirmação de agendamento, usar endpoint específico
      if (scheduledVisitor?.id) {
        await client.patch(
          `/entries/scheduled/${scheduledVisitor.id}/confirm`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await client.post("/entries", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log("✅ Visitante cadastrado com sucesso");
      alert("✅ Visitante registrado com sucesso!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("❌ Erro ao cadastrar visitante:", error);
      alert("❌ Erro ao registrar visitante. Tente novamente.");
    }
  };

  const handleImageCapture = (base64) => {
    setImageBase64(base64);
  };

  return (
    <Flex width="100%" height="100vh">
      {/* Painel lateral de pessoas não autorizadas (apenas para Guarda) */}
      {auth.user.role === "Guarda" && (
        <Box
          width="300px"
          bg="gray.100"
          borderRight="2px solid"
          borderColor="gray.300"
          p={4}
          overflowY="auto"
          position="fixed"
          left={0}
          top="5rem"
          bottom={0}
          zIndex={10}
        >
          <VStack spacing={3} align="stretch">
            <Badge
              fontSize="1rem"
              colorScheme="red"
              p={2}
              textAlign="center"
              borderRadius="md"
            >
              <Icon as={FaExclamationTriangle} mr={2} />
              PESSOAS NÃO AUTORIZADAS
            </Badge>

            <InputGroup size="sm">
              <InputLeftElement>
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Buscar por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="white"
              />
            </InputGroup>

            <Text fontSize="xs" color="gray.600" textAlign="center">
              {filteredPessoas.length} pessoa(s) encontrada(s)
            </Text>

            <Divider />

            {loading ? (
              <Text textAlign="center">Carregando...</Text>
            ) : (
              <VStack
                spacing={2}
                align="stretch"
                maxH="calc(100vh - 250px)"
                overflowY="auto"
              >
                {filteredPessoas.map((pessoa) => (
                  <Box
                    key={pessoa.id}
                    p={3}
                    bg="white"
                    border="1px solid"
                    borderColor="red.200"
                    borderRadius="md"
                    boxShadow="sm"
                  >
                    <HStack spacing={3}>
                      {pessoa.imagePath && (
                        <Image
                          src={`/api/images/pessoas-nao-autorizadas/${pessoa.imagePath
                            .split("/")
                            .pop()}`}
                          alt="Foto"
                          boxSize="40px"
                          objectFit="cover"
                          borderRadius="md"
                          border="1px solid"
                          borderColor="gray.300"
                        />
                      )}
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontSize="xs" fontWeight="bold" color="red.700">
                          {pessoa.nome}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          CPF: {pessoa.CPF}
                        </Text>
                        {pessoa.identidade && (
                          <Text fontSize="xs" color="gray.600">
                            ID: {pessoa.identidade}
                          </Text>
                        )}
                        {pessoa.observacao && (
                          <Text
                            fontSize="xs"
                            color="red.600"
                            fontStyle="italic"
                          >
                            {pessoa.observacao}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </Box>
                ))}

                {filteredPessoas.length === 0 && !loading && (
                  <Text textAlign="center" color="gray.500" fontSize="sm">
                    {searchTerm
                      ? "Nenhuma pessoa encontrada"
                      : "Nenhuma pessoa não autorizada cadastrada"}
                  </Text>
                )}
              </VStack>
            )}
          </VStack>
        </Box>
      )}

      {/* Formulário principal */}
      <Box flex={1} ml={auth.user.role === "Guarda" ? "300px" : "0"} p={4}>
        <S.Container>
          <S.Form onSubmit={handleSubmit}>
            <S.StyledFormControl>
              {scheduledVisitor && (
                <Alert status="success" mb={4}>
                  <AlertIcon />
                  <Box>
                    <strong>Confirmando agendamento:</strong>{" "}
                    {scheduledVisitor.name}
                    <br />
                    <small>
                      Agendado para:{" "}
                      {new Date(scheduledVisitor.scheduledDate).toLocaleString(
                        "pt-BR"
                      )}
                    </small>
                  </Box>
                </Alert>
              )}

              <S.StyledGrid templateColumns="repeat(4, 1fr)" gap={1}>
                {/* Dados pessoais */}
                <Box w="90%" p={1} h="auto" minH="200px" maxH="400px">
                  <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
                    Dados pessoais
                  </Badge>
                  <FormLabel htmlFor="completeName">Nome Completo</FormLabel>
                  <S.StyledInput
                    type="text"
                    name="completeName"
                    placeholder="Digite o nome completo"
                    pattern="[A-Za-zÀ-ÿ\s]{3,}"
                    title="Nome deve ter pelo menos 3 caracteres (apenas letras e espaços)"
                    minLength="3"
                    style={{ textTransform: "capitalize" }}
                    required
                  />
                  <FormLabel htmlFor="idNumber">CPF</FormLabel>
                  <S.StyledInput
                    type="text"
                    name="idNumber"
                    placeholder="000.000.000-00"
                    pattern="[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}"
                    title="Digite um CPF válido (000.000.000-00)"
                    maxLength="14"
                    onInput={(e) => {
                      // Formatação automática do CPF
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 11) {
                        value = value.replace(/(\d{3})(\d)/, "$1.$2");
                        value = value.replace(/(\d{3})(\d)/, "$1.$2");
                        value = value.replace(/(\d{3})(\d{1,2})/, "$1-$2");
                        e.target.value = value;
                      }
                    }}
                    required
                  />
                  <FormLabel htmlFor="phoneNumber">Telefone Contato</FormLabel>
                  <S.StyledInput
                    type="tel"
                    name="phoneNumber"
                    placeholder="(11) 99999-9999"
                    pattern="\([0-9]{2}\)\s[0-9]{4,5}-[0-9]{4}"
                    title="Digite um telefone válido (DD) 9XXXX-XXXX"
                    maxLength="15"
                    onInput={(e) => {
                      // Formatação automática do telefone
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 11) {
                        value = value.replace(/(\d{2})(\d)/, "($1) $2");
                        value = value.replace(/(\d{5})(\d{1,4})/, "$1-$2");
                        e.target.value = value;
                      }
                    }}
                    required
                  />
                </Box>

                {/* Dados do veículo */}
                <Box w="90%" p={1} h="auto" minH="200px" maxH="400px">
                  <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
                    Dados do veículo
                  </Badge>
                  <FormLabel htmlFor="carModel">Modelo do veículo</FormLabel>
                  <S.StyledInput type="text" name="carModel" />
                  <FormLabel htmlFor="licensePlate">Placa</FormLabel>
                  <S.StyledInput
                    type="text"
                    name="licensePlate"
                    placeholder="ABC-1234 ou ABC1D23"
                    pattern="[A-Z]{3}-?[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2}"
                    title="Digite uma placa brasileira válida (ABC-1234 ou ABC1D23)"
                    maxLength="8"
                    style={{ textTransform: "uppercase" }}
                    onInput={(e) => {
                      // Formatar placa automaticamente
                      let value = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "");
                      if (value.length <= 7) {
                        // Formato antigo: ABC1234 -> ABC-1234
                        if (
                          value.length === 7 &&
                          /^[A-Z]{3}[0-9]{4}$/.test(value)
                        ) {
                          value = value.replace(
                            /([A-Z]{3})([0-9]{4})/,
                            "$1-$2"
                          );
                        }
                        // Formato Mercosul: ABC1D23 (sem hífen)
                        e.target.value = value;
                      }
                    }}
                    required
                  />
                  <FormLabel htmlFor="color">Cor</FormLabel>
                  <S.StyledInput type="text" name="color" />
                </Box>

                {/* Dados do Destino */}
                <Box w="90%" p={1} h="auto" minH="200px" maxH="400px">
                  <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
                    Dados do Destino
                  </Badge>
                  <FormLabel htmlFor="contactPerson">
                    Com quem vai falar:
                  </FormLabel>
                  <S.StyledInput
                    type="text"
                    name="contactPerson"
                    placeholder="Nome da pessoa que receberá o visitante"
                    pattern="[A-Za-zÀ-ÿ\s]{2,}"
                    title="Nome do contato (apenas letras e espaços)"
                    style={{ textTransform: "capitalize" }}
                    required
                  />
                  <FormLabel htmlFor="section">Seção de Destino</FormLabel>
                  <Select name="section">
                    <option value="RP">RP</option>
                    <option value="SFPC">SFPC</option>
                    <option value="Cmt">Cmt</option>
                    <option value="SCmt">Scmt</option>
                    <option value="Estande">Estande</option>
                    <option value="Adj Cmdo">Adj Cmdo</option>
                    <option value="SecInfor">SecInfor</option>
                    <option value="SecJur">SecJur</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                    <option value="S4">S4</option>
                    <option value="Pelotões">Pelotões</option>
                    <option value="SubCias">SubCias</option>
                    <option value="Outros">Outros</option>
                  </Select>
                </Box>

                {/* Captura de Imagem */}
                <Box w="90%" p={1} h="auto" minH="200px" maxH="400px">
                  <Badge fontSize="1.1rem" mb="1rem" colorScheme="red">
                    Foto do Visitante
                  </Badge>
                  <ImageCapture onImageCapture={handleImageCapture} />
                </Box>
              </S.StyledGrid>

              <S.StyledBox>
                <Button colorScheme="red" type="submit">
                  {scheduledVisitor
                    ? "Confirmar Entrada Agendada"
                    : "Registrar Entrada"}
                </Button>
              </S.StyledBox>
            </S.StyledFormControl>
          </S.Form>
        </S.Container>
      </Box>
    </Flex>
  );
};

export default VisitorForm;
