import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  useToast,
  Text,
  Image,
  IconButton,
  Alert,
  AlertIcon,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import { MdClose, MdImage, MdQrCode, MdDownload } from "react-icons/md";
import QRCode from "qrcode";
import client from "../../services/client";
import * as S from "./styles";

const PermissionarioForm = ({ toEdit, setToEdit, reload, setReload }) => {
  const navigate = useNavigate();
  const [imageBase64, setImageBase64] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState(null); // Para QR Code
  const fileInputRef = useRef(null);
  const toast = useToast();

  // Carregar dados do permissionário para edição
  useEffect(() => {
    if (toEdit) {
      // Preencher campos do formulário
      if (document.getElementById("completeName")) {
        document.getElementById("completeName").value =
          toEdit.completeName || "";
        document.getElementById("idNumber").value = toEdit.idNumber || "";
        document.getElementById("CPF").value = toEdit.CPF || "";
        document.getElementById("local").value = toEdit.local || "";
        document.getElementById("carModel").value = toEdit.carModel || "";
        document.getElementById("licensePlate").value =
          toEdit.licensePlate || "";
        document.getElementById("color").value = toEdit.color || "";
      }

      // Carregar imagem existente
      if (toEdit.imagePath) {
        setCurrentImage(toEdit.imagePath);
      }

      // Gerar QR Code
      if (toEdit.CPF) {
        generateQRCode(toEdit.CPF);
      }
    } else {
      // Limpar formulário para novo cadastro
      if (document.getElementById("permissionarioForm")) {
        document.getElementById("permissionarioForm").reset();
      }
      setCurrentImage(null);
      setImageBase64("");
      setSelectedFile(null);
      setPreviewImage(null);
      setImgUrl(null);
    }
  }, [toEdit]);

  // Gerar QR Code
  const generateQRCode = async (cpf) => {
    try {
      const stringify = `{"permissionario": ${JSON.stringify(cpf)}}`;
      const response = await QRCode.toDataURL(stringify);
      setImgUrl(response);
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
    }
  };

  // Função para selecionar arquivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setSelectedFile(file);

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // Limpar outras opções de imagem
      setImageBase64("");
      setCurrentImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    // Criar FormData para multipart
    const submitData = new FormData();

    // Adicionar campos de texto
    submitData.append("completeName", formData.get("completeName"));
    submitData.append("idNumber", formData.get("idNumber"));
    submitData.append("CPF", formData.get("CPF").replace(/\D/g, ""));
    submitData.append("local", formData.get("local"));
    submitData.append("carModel", formData.get("carModel") || "");
    submitData.append("licensePlate", formData.get("licensePlate") || "");
    submitData.append("color", formData.get("color") || "");

    // Adicionar imagem
    if (selectedFile) {
      // Usar arquivo selecionado
      submitData.append("image", selectedFile);
      console.log("🖼️ Arquivo selecionado adicionado ao FormData");
    } else if (imageBase64) {
      // Usar imagem capturada (base64)
      const base64Data = imageBase64.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      submitData.append("image", blob, "permissionario.jpg");
      console.log("🖼️ Imagem capturada adicionada ao FormData");
    } else if (toEdit && currentImage && !previewImage) {
      // Manter imagem existente
      submitData.append("keepExistingImage", "true");
    } else if (toEdit && !currentImage) {
      // Remover imagem
      submitData.append("removeImage", "true");
    }

    console.log("📤 Enviando permissionário multipart...");

    try {
      if (toEdit?.id) {
        const response = await client.patch(
          `/permissionarios/${toEdit.id}`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast({
          title: "Permissionário atualizado",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Gerar QR Code com CPF atualizado
        generateQRCode(formData.get("CPF").replace(/\D/g, ""));

        // Atualizar dados do componente
        setToEdit(response.data);
      } else {
        const response = await client.post("/permissionarios", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast({
          title: "Permissionário cadastrado",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Gerar QR Code
        generateQRCode(formData.get("CPF").replace(/\D/g, ""));

        // Definir como editando o novo permissionário
        setToEdit(response.data);
      }

      setReload(!reload);
      console.log("✅ Permissionário salvo com sucesso");
    } catch (error) {
      console.error("❌ Erro ao salvar permissionário:", error);

      let errorMessage = "Erro ao salvar permissionário";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast({
        title: "Erro",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageCapture = (imageData) => {
    setImageBase64(imageData);
    setSelectedFile(null);
    setPreviewImage(null);
    setCurrentImage(null);
    console.log("📸 Imagem capturada para permissionário");
  };

  const removeCurrentImage = () => {
    setCurrentImage(null);
    setImageBase64("");
    setSelectedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadQRCode = () => {
    if (!imgUrl || !toEdit?.completeName || !toEdit?.CPF) {
      toast({
        title: "Erro",
        description: "QR Code não disponível",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const link = document.createElement("a");
    link.href = imgUrl;
    const fileName = `${toEdit.completeName}_${toEdit.CPF}.png`;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Code baixado",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <S.Wrapper>
      <Box w="90%" p={4} maxWidth="800px" mx="auto">
        <form id="permissionarioForm" onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              {toEdit ? "Editar Permissionário" : "Cadastrar Permissionário"}
            </Text>

            <Alert status="info">
              <AlertIcon />
              Cadastre um permissionário para acesso autorizado ao local com QR
              Code personalizado.
            </Alert>

            {/* Dados Pessoais */}
            <Badge fontSize="1.1rem" colorScheme="blue" p={2} borderRadius="md">
              Dados Pessoais
            </Badge>

            {/* Campo Nome Completo */}
            <FormControl isRequired>
              <FormLabel>Nome Completo</FormLabel>
              <Input
                id="completeName"
                name="completeName"
                placeholder="Nome completo do permissionário"
                pattern="[A-Za-zÀ-ÿ\s]{3,}"
                title="Nome deve ter pelo menos 3 caracteres"
                minLength="3"
                style={{ textTransform: "capitalize" }}
              />
            </FormControl>

            <HStack spacing={4}>
              {/* Campo Identidade */}
              <FormControl isRequired>
                <FormLabel>Identidade</FormLabel>
                <Input
                  id="idNumber"
                  name="idNumber"
                  placeholder="Número da identidade"
                />
              </FormControl>

              {/* Campo CPF */}
              <FormControl isRequired>
                <FormLabel>CPF</FormLabel>
                <Input
                  id="CPF"
                  name="CPF"
                  placeholder="000.000.000-00"
                  pattern="[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}"
                  title="Digite um CPF válido (000.000.000-00)"
                  maxLength={14}
                  onInput={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 11) {
                      value = value.replace(/(\d{3})(\d)/, "$1.$2");
                      value = value.replace(/(\d{3})(\d)/, "$1.$2");
                      value = value.replace(/(\d{3})(\d{1,2})/, "$1-$2");
                      e.target.value = value;
                    }
                  }}
                />
              </FormControl>
            </HStack>

            {/* Campo Local de Trabalho */}
            <FormControl isRequired>
              <FormLabel>Local de Trabalho</FormLabel>
              <Input
                id="local"
                name="local"
                placeholder="Setor, departamento ou local de trabalho"
              />
            </FormControl>

            {/* Dados do Veículo */}
            <Badge
              fontSize="1.1rem"
              colorScheme="green"
              p={2}
              borderRadius="md"
            >
              Dados do Veículo (Opcional)
            </Badge>

            <HStack spacing={4}>
              {/* Campo Modelo do Veículo */}
              <FormControl>
                <FormLabel>Modelo do Veículo</FormLabel>
                <Input
                  id="carModel"
                  name="carModel"
                  placeholder="Ex: Honda Civic"
                />
              </FormControl>

              {/* Campo Placa */}
              <FormControl>
                <FormLabel>Placa</FormLabel>
                <Input
                  id="licensePlate"
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
                />
              </FormControl>
            </HStack>

            {/* Campo Cor do Veículo */}
            <FormControl>
              <FormLabel>Cor do Veículo</FormLabel>
              <Input
                id="color"
                name="color"
                placeholder="Ex: Branco, Prata, Azul"
              />
            </FormControl>

            {/* Seção de Imagem */}
            <Badge
              fontSize="1.1rem"
              colorScheme="purple"
              p={2}
              borderRadius="md"
            >
              Foto do Permissionário
            </Badge>

            <FormControl>
              {/* Input oculto para seleção de arquivo */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: "none" }}
                disabled={loading}
              />

              {/* Imagem Atual (do banco) */}
              {currentImage && !imageBase64 && !previewImage && (
                <Box position="relative" display="inline-block" mb={4}>
                  <Image
                    src={`/api/images/permissionarios/${currentImage
                      .split("/")
                      .pop()}`}
                    alt="Foto atual"
                    maxWidth="200px"
                    maxHeight="200px"
                    objectFit="cover"
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                  />
                  <IconButton
                    icon={<MdClose />}
                    size="sm"
                    colorScheme="red"
                    position="absolute"
                    top={-2}
                    right={-2}
                    onClick={removeCurrentImage}
                  />
                </Box>
              )}

              {/* Preview da imagem selecionada do arquivo */}
              {previewImage && (
                <Box position="relative" display="inline-block" mb={4}>
                  <Image
                    src={previewImage}
                    alt="Imagem selecionada"
                    maxWidth="200px"
                    maxHeight="200px"
                    objectFit="cover"
                    border="2px solid"
                    borderColor="blue.200"
                    borderRadius="md"
                  />
                  <IconButton
                    icon={<MdClose />}
                    size="sm"
                    colorScheme="red"
                    position="absolute"
                    top={-2}
                    right={-2}
                    onClick={removeCurrentImage}
                  />
                </Box>
              )}

              {/* Nova Imagem Capturada */}
              {imageBase64 && !previewImage && (
                <Box position="relative" display="inline-block" mb={4}>
                  <Image
                    src={imageBase64}
                    alt="Nova foto capturada"
                    maxWidth="200px"
                    maxHeight="200px"
                    objectFit="cover"
                    border="2px solid"
                    borderColor="green.200"
                    borderRadius="md"
                  />
                  <IconButton
                    icon={<MdClose />}
                    size="sm"
                    colorScheme="red"
                    position="absolute"
                    top={-2}
                    right={-2}
                    onClick={removeCurrentImage}
                  />
                </Box>
              )}

              {/* Botões de ação para foto */}
              {!currentImage && !imageBase64 && !previewImage && (
                <VStack spacing={3} align="stretch">
                  <Button
                    leftIcon={<MdImage />}
                    onClick={openFileSelector}
                    colorScheme="blue"
                    variant="outline"
                    disabled={loading}
                  >
                    Selecionar Imagem do Arquivo
                  </Button>
                </VStack>
              )}

              {(currentImage || imageBase64 || previewImage) && (
                <HStack spacing={2} mt={2}>
                  <Button
                    leftIcon={<MdImage />}
                    onClick={openFileSelector}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    Selecionar Arquivo
                  </Button>
                </HStack>
              )}

              <Text fontSize="xs" color="gray.500" mt={2}>
                Selecione uma foto do permissionário (máximo 5MB)
              </Text>
            </FormControl>

            {/* Botão de Submit */}
            <HStack spacing={4} justify="center">
              <Button
                colorScheme="gray"
                variant="outline"
                onClick={() => navigate("/lista-permissionarios")}
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                colorScheme="red"
                isLoading={loading}
                loadingText={toEdit ? "Atualizando..." : "Cadastrando..."}
              >
                {toEdit
                  ? "Atualizar Permissionário"
                  : "Cadastrar Permissionário"}
              </Button>
            </HStack>

            {/* QR Code Section */}
            {toEdit && imgUrl && (
              <Box mt={6} textAlign="center">
                <Badge
                  fontSize="1.1rem"
                  colorScheme="orange"
                  p={2}
                  borderRadius="md"
                  mb={4}
                >
                  QR Code do Permissionário
                </Badge>
                <VStack spacing={3}>
                  <Box position="relative">
                    <Image
                      src={imgUrl}
                      alt="QR Code"
                      boxSize="200px"
                      border="2px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                    />
                  </Box>
                  <Tooltip label="Baixar QR Code como imagem">
                    <Button
                      leftIcon={<MdDownload />}
                      colorScheme="blue"
                      onClick={handleDownloadQRCode}
                      size="sm"
                    >
                      Baixar QR Code
                    </Button>
                  </Tooltip>
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    Use este QR Code para acesso rápido do permissionário
                  </Text>
                </VStack>
              </Box>
            )}
          </VStack>
        </form>
      </Box>
    </S.Wrapper>
  );
};

export default PermissionarioForm;
