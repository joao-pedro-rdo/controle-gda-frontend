import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Flex,
  Image,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import client from "../../services/client";
import AuthenticatedImage from "../AuthenticatedImage";

const PermissionarioPopup = ({ isOpen, onClose, onSelect }) => {
  const [permissionarios, setPermissionarios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      client
        .get("/permissionarios")
        .then((res) => {
          setPermissionarios(res.data);
          console.log("📋 Permissionários carregados:", res.data.length);
        })
        .catch((error) => {
          console.error("❌ Erro ao carregar permissionários:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxHeight="80vh">
        <ModalHeader>Selecionar Permissionário</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {loading ? (
            <Flex justify="center" align="center" py={8}>
              <Text>Carregando permissionários...</Text>
            </Flex>
          ) : (
            <VStack spacing={4}>
              {permissionarios.length === 0 ? (
                <Text>Nenhum permissionário encontrado</Text>
              ) : (
                permissionarios.map((p) => (
                  <Flex
                    key={p.id}
                    align="center"
                    justify="space-between"
                    w="100%"
                    border="1px solid #eee"
                    borderRadius="md"
                    p={3}
                    _hover={{
                      borderColor: "blue.300",
                      shadow: "md",
                    }}
                  >
                    {/* Foto do Permissionário */}
                    {p.imagePath ? (
                      <AuthenticatedImage
                        imagePath={p.imagePath}
                        alt={p.completeName}
                        boxSize="60px"
                        borderRadius="full"
                        objectFit="cover"
                        border="2px solid"
                        borderColor="green.300"
                      />
                    ) : (
                      <Box
                        boxSize="60px"
                        borderRadius="full"
                        bg="gray.200"
                        display="flex"
                        align="center"
                        justify="center"
                      >
                        <Text fontSize="xs" color="gray.500">
                          Sem foto
                        </Text>
                      </Box>
                    )}

                    {/* Informações do Permissionário */}
                    <Box flex="1" ml={4}>
                      <Text fontWeight="bold" fontSize="md">
                        {p.completeName}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        📍 {p.local || "Local não informado"}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        CPF: {p.CPF}
                      </Text>
                    </Box>

                    {/* Botão Adicionar */}
                    <Button
                      colorScheme="green"
                      onClick={() => onSelect(p)}
                      size="sm"
                    >
                      ✓ Adicionar
                    </Button>
                  </Flex>
                ))
              )}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PermissionarioPopup;
