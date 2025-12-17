import React, { useState, useContext } from "react";
import {
    Box,
    Button,
    Text,
    useDisclosure,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Flex,
    Spinner,
    Alert,
    AlertIcon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { useUnauthorizedPeople } from "../hooks/useUnauthorizedPeople";
import UnauthorizedPersonCard from "../components/features/Unauthorized/UnauthorizedPersonCard";
import { PessoaNaoAutorizadaForm } from "../components/features/Unauthorized/PessoaNaoAutorizadaForm";
import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";

export const PessoasNaoAutorizadas = () => {
    const { people, loading, error, deletePerson, addPerson, updatePerson, fetchPeople } = useUnauthorizedPeople();
    const [toEdit, setToEdit] = useState(null);
    const [toDelete, setToDelete] = useState(null);

    const { user } = useContext(AuthContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
    } = useDisclosure();

    const toast = useToast();
    const cancelRef = React.useRef();

    const canEdit = user?.role === "S2";
    const canView = user?.role === "S2" || user?.role === "Guarda";

    if (!canView) {
        return <Unauthorized />;
    }

    const handleEdit = (person) => {
        setToEdit(person);
        onOpen();
    };

    const handleDelete = (person) => {
        setToDelete(person);
        onDeleteOpen();
    };

    const confirmDelete = async () => {
        try {
            await deletePerson(toDelete.id);
            toast({
                title: "Pessoa removida",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onDeleteClose();
            setToDelete(null);
        } catch (error) {
            toast({
                title: "Erro ao remover pessoa",
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="bg-white shadow print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Pessoas Não Autorizadas
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Gerencie a lista de pessoas com acesso restrito.
                        </p>
                    </div>
                    {canEdit && (
                        <Button
                            leftIcon={<MdAdd />}
                            colorScheme="red"
                            onClick={handleCreateNew}
                        >
                            Cadastrar Nova Pessoa
                        </Button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Alert status="warning" mb="6" rounded="md">
                    <AlertIcon />
                    <Box>
                        <Text fontWeight="bold">Lista de Segurança</Text>
                        <Text fontSize="sm">
                            Pessoas listadas aqui não devem ter acesso autorizado às instalações.
                            {!canEdit && " Consulte o S2 para alterações."}
                        </Text>
                    </Box>
                </Alert>

                {loading && (
                    <Flex justify="center" p={8}>
                        <Spinner size="lg" color="red.500" />
                    </Flex>
                )}

                {error && (
                    <Alert status="error" rounded="md">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}

                {!loading && !error && people.length === 0 && (
                    <Box textAlign="center" p={8}>
                        <Text fontSize="lg" color="gray.500">
                            Nenhuma pessoa não autorizada cadastrada
                        </Text>
                    </Box>
                )}

                {!loading && !error && people.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {people.map((person) => (
                            <UnauthorizedPersonCard
                                key={person.id}
                                person={person}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                canEdit={canEdit}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {toEdit ? "Editar Pessoa" : "Cadastrar Pessoa"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <PessoaNaoAutorizadaForm
                            toEdit={toEdit}
                            onClose={onClose}
                            onSuccess={fetchPeople}
                            addPerson={addPerson}
                            updatePerson={updatePerson}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>

            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Excluir Pessoa
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Tem certeza que deseja remover <strong>{toDelete?.nome}</strong> da lista?
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
        </div>
    );
};