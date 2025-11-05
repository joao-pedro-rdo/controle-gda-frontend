// Arquivo: front/src/components/PessoaNaoAutorizadaForm/index.js
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  useToast,
  Text,
  Image,
  IconButton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

import { MdClose, MdImage, MdEdit, MdDelete } from "react-icons/md";

import { PhotoCapture } from "../PhotoCapture";
import client from "../../services/client";

export const PessoaNaoAutorizadaForm = ({
  onClose,
  onSuccess,
  toEdit = null,
  reload,
  setReload,
}) => {
  const [imageBase64, setImageBase64] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (toEdit) {
      setCurrentImage(toEdit.imagePath);
    }
  }, [toEdit]);

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
    submitData.append("nome", formData.get("nome"));
    submitData.append("CPF", formData.get("CPF").replace(/\D/g, ""));
    submitData.append("identidade", formData.get("identidade") || "");
    submitData.append("observacao", formData.get("observacao") || "");

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

      submitData.append("image", blob, "pessoa-nao-autorizada.jpg");
      console.log("🖼️ Imagem capturada adicionada ao FormData");
    }

    console.log("📤 Enviando pessoa não autorizada multipart...");

    try {
      if (toEdit?.id) {
        await client.patch(
          `/pessoas-nao-autorizadas/${toEdit.id}`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast({
          title: "Pessoa não autorizada atualizada",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await client.post("/pessoas-nao-autorizadas", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast({
          title: "Pessoa não autorizada cadastrada",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      setReload(!reload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Erro ao salvar pessoa não autorizada:", error);

      let errorMessage = "Erro ao salvar pessoa não autorizada";
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
    console.log("📸 Imagem capturada para pessoa não autorizada");
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

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            {toEdit
              ? "Editar Pessoa Não Autorizada"
              : "Cadastrar Pessoa Não Autorizada"}
          </Text>

          <Alert status="warning">
            <AlertIcon />
            Esta pessoa será marcada como não autorizada no sistema de controle
            de acesso.
          </Alert>

          <FormControl isRequired>
            <FormLabel>Nome Completo</FormLabel>
            <Input
              name="nome"
              placeholder="Digite o nome completo"
              defaultValue={toEdit?.nome || ""}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>CPF</FormLabel>
            <Input
              name="CPF"
              placeholder="000.000.000-00"
              defaultValue={toEdit?.CPF || ""}
              maxLength={14}
              onChange={(e) => {
                // Formatação automática do CPF
                let value = e.target.value.replace(/\D/g, "");
                value = value.replace(/(\d{3})(\d)/, "$1.$2");
                value = value.replace(/(\d{3})(\d)/, "$1.$2");
                value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                e.target.value = value;
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Identidade</FormLabel>
            <Input
              name="identidade"
              placeholder="Número da identidade"
              defaultValue={toEdit?.identidade || ""}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Observação</FormLabel>
            <Textarea
              name="observacao"
              placeholder="Motivo da restrição, observações importantes..."
              rows={4}
              defaultValue={toEdit?.observacao || ""}
            />
          </FormControl>

          {/* Seção de Imagem */}
          <FormControl>
            <FormLabel>Foto da Pessoa</FormLabel>

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
                  src={`/api/images/pessoas-nao-autorizadas/${currentImage
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
              Selecione uma foto da pessoa (máximo 5MB) ou use a câmera para
              capturar
            </Text>
          </FormControl>

          <HStack spacing={4} justify="center">
            <Button
              colorScheme="gray"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              colorScheme="red"
              isLoading={loading}
              loadingText={toEdit ? "Atualizando..." : "Cadastrando..."}
            >
              {toEdit ? "Atualizar" : "Cadastrar"}
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};
