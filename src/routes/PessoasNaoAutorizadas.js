// Arquivo: front/src/routes/PessoasNaoAutorizadas.js
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  Card,
  CardBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  IconButton,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

// 🔧 SUBSTITUIR @chakra-ui/icons por react-icons
import { MdDelete, MdEdit, MdAdd } from "react-icons/md";

import client from "../services/client";
import { AuthContext } from "../context/AuthContext";
import { PessoaNaoAutorizadaForm } from "../components/PessoaNaoAutorizadaForm";

export const PessoasNaoAutorizadas = () => {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toEdit, setToEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [reload, setReload] = useState(false);

  const { user } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const toast = useToast();
  const cancelRef = React.useRef();

  // Verificar se usuário tem permissão
  const canEdit = user?.role === "S2";
  const canView = user?.role === "S2" || user?.role === "Guarda";

  useEffect(() => {
    if (!canView) {
      return;
    }
    fetchPessoas();
  }, [reload, canView]);

  const fetchPessoas = async () => {
    try {
      setLoading(true);
      const response = await client.get("/pessoas-nao-autorizadas");
      setPessoas(response.data);
    } catch (error) {
      console.error("Erro ao buscar pessoas não autorizadas:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar pessoas não autorizadas",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pessoa) => {
    setToEdit(pessoa);
    onOpen();
  };

  const handleDelete = (pessoa) => {
    setToDelete(pessoa);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    try {
      await client.delete(`/pessoas-nao-autorizadas/${toDelete.id}`);

      toast({
        title: "Pessoa removida",
        description: `${toDelete.nome} foi removida da lista`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setReload(!reload);
      onDeleteClose();
      setToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir pessoa:", error);
      toast({
        title: "Erro",
        description: "Erro ao remover pessoa não autorizada",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateNew = () => {
    setToEdit(null);
    onOpen();
  };

  const formatCPF = (cpf) => {
    if (!cpf) return "";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  if (!canView) {
    return (
      <Box p={6} textAlign="center">
        <Alert status="error">
          <AlertIcon />
          Você não tem permissão para acessar esta página.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" color="red.600">
            Pessoas Não Autorizadas
          </Text>

          {canEdit && (
            <Button
              leftIcon={<MdAdd />}
              colorScheme="red"
              onClick={handleCreateNew}
            >
              Cadastrar Nova Pessoa
            </Button>
          )}
        </HStack>

        <Alert status="warning">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Lista de Segurança</Text>
            <Text fontSize="sm">
              Pessoas listadas aqui não devem ter acesso autorizado às
              instalações.
              {!canEdit && " Consulte o S2 para alterações."}
            </Text>
          </Box>
        </Alert>

        {/* Loading */}
        {loading && (
          <Flex justify="center" p={8}>
            <Spinner size="lg" color="red.500" />
          </Flex>
        )}

        {/* Lista Vazia */}
        {!loading && pessoas.length === 0 && (
          <Box textAlign="center" p={8}>
            <Text fontSize="lg" color="gray.500">
              Nenhuma pessoa não autorizada cadastrada
            </Text>
          </Box>
        )}

        {/* Lista de Pessoas */}
        {!loading && pessoas.length > 0 && (
          <VStack spacing={4} align="stretch">
            {pessoas.map((pessoa) => (
              <Card key={pessoa.id} variant="outline" borderColor="red.200">
                <CardBody>
                  <HStack spacing={4} align="start">
                    {/* Foto */}
                    <Box flexShrink={0}>
                      {pessoa.imagePath ? (
                        <Image
                          src={`/api/images/pessoas-nao-autorizadas/${pessoa.imagePath
                            .split("/")
                            .pop()}`}
                          alt={pessoa.nome}
                          width="80px"
                          height="80px"
                          objectFit="cover"
                          borderRadius="md"
                          border="2px solid"
                          borderColor="red.200"
                        />
                      ) : (
                        <Box
                          width="80px"
                          height="80px"
                          bg="gray.100"
                          borderRadius="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          border="2px solid"
                          borderColor="gray.200"
                        >
                          <Text fontSize="xs" color="gray.500">
                            Sem foto
                          </Text>
                        </Box>
                      )}
                    </Box>

                    {/* Dados */}
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack>
                        <Text fontWeight="bold" fontSize="lg">
                          {pessoa.nome}
                        </Text>
                        <Badge colorScheme="red" variant="solid">
                          NÃO AUTORIZADA
                        </Badge>
                      </HStack>

                      <Text color="gray.600">
                        <strong>CPF:</strong> {formatCPF(pessoa.CPF)}
                      </Text>

                      {pessoa.identidade && (
                        <Text color="gray.600">
                          <strong>Identidade:</strong> {pessoa.identidade}
                        </Text>
                      )}

                      {pessoa.observacao && (
                        <Text color="gray.700" fontSize="sm">
                          <strong>Observação:</strong> {pessoa.observacao}
                        </Text>
                      )}

                      <Text fontSize="xs" color="gray.500">
                        Cadastrado em:{" "}
                        {new Date(pessoa.createdAt).toLocaleDateString("pt-BR")}
                      </Text>
                    </VStack>

                    {/* Ações */}
                    {canEdit && (
                      <VStack spacing={2}>
                        <IconButton
                          icon={<MdEdit />}
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pessoa)}
                          aria-label="Editar pessoa"
                        />
                        <IconButton
                          icon={<MdDelete />}
                          colorScheme="red"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pessoa)}
                          aria-label="Excluir pessoa"
                        />
                      </VStack>
                    )}
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}
      </VStack>

      {/* Modal de Cadastro/Edição */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {toEdit
              ? "Editar Pessoa Não Autorizada"
              : "Cadastrar Pessoa Não Autorizada"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PessoaNaoAutorizadaForm
              toEdit={toEdit}
              onClose={onClose}
              onSuccess={() => {
                console.log("Pessoa salva com sucesso");
              }}
              reload={reload}
              setReload={setReload}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Pessoa Não Autorizada
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja remover <strong>{toDelete?.nome}</strong>{" "}
              da lista? Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
