import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Badge,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import ScheduleVisitorForm from "../components/features/Visitor/ScheduleVisitorForm";
import { useAuth } from "../context/AuthContext";
import client from "../services/client";
import { localDayRange } from "../utils/dates";
import { apiErrorMessage, digitsOnly, formatCpf } from "../utils/validation";

// Gerenciamento dos agendamentos pendentes (S2): ver os de hoje e futuros
// (ou também os vencidos, que a Guarda não confirmou), editar e excluir.
const ManageScheduledVisitors = () => {
    const auth = useAuth();
    const toast = useToast();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scope, setScope] = useState("upcoming");
    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [deletingBusy, setDeletingBusy] = useState(false);
    const cancelRef = useRef();

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = scope === "upcoming" ? { from: localDayRange().from } : {};
            const response = await client.get("/entries/scheduled", { params });
            setItems(response.data || []);
        } catch (err) {
            setError(apiErrorMessage(err, "Não foi possível carregar os agendamentos."));
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [scope]);

    useEffect(() => {
        if (auth.user.role === "S2") load();
    }, [auth.user.role, load]);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        const termDigits = digitsOnly(term);
        if (!term) return items;
        return items.filter(
            (item) =>
                item.name?.toLowerCase().includes(term) ||
                item.target?.toLowerCase().includes(term) ||
                item.contactPerson?.toLowerCase().includes(term) ||
                (termDigits.length >= 3 && digitsOnly(item.idNumber).includes(termDigits))
        );
    }, [items, search]);

    if (auth.user.role !== "S2") return <Unauthorized />;

    const handleDelete = async () => {
        if (!deleting) return;
        setDeletingBusy(true);
        try {
            await client.delete(`/entries/scheduled/${deleting.id}`);
            toast({ title: "Agendamento excluído", status: "success", duration: 3000, isClosable: true });
            setDeleting(null);
            load();
        } catch (err) {
            toast({
                title: "Erro ao excluir",
                description: apiErrorMessage(err, "Não foi possível excluir o agendamento."),
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setDeletingBusy(false);
        }
    };

    const now = new Date();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🗂️ Gerenciar Agendamentos</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Agendamentos ainda não confirmados pela Guarda. Depois da entrada, o registro vai para o relatório.
                        </p>
                    </div>
                    <Button as={Link} to="/agendar-visitante" colorScheme="red">
                        Novo Agendamento
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <Select value={scope} onChange={(e) => setScope(e.target.value)} maxW={{ md: "260px" }} bg="white">
                        <option value="upcoming">De hoje em diante</option>
                        <option value="all">Todos (inclui vencidos)</option>
                    </Select>
                    <Input
                        placeholder="Buscar por nome, CPF, destino ou contato"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        bg="white"
                    />
                </div>

                {loading && <p className="text-gray-600 py-8 text-center">Carregando agendamentos...</p>}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
                )}
                {!loading && !error && filtered.length === 0 && (
                    <p className="text-gray-600 py-8 text-center">Nenhum agendamento encontrado.</p>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <Table size="sm">
                            <Thead>
                                <Tr>
                                    <Th>Data / Hora</Th>
                                    <Th>Visitante</Th>
                                    <Th>CPF</Th>
                                    <Th>Veículo</Th>
                                    <Th>Destino</Th>
                                    <Th>Contato</Th>
                                    <Th textAlign="right">Ações</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filtered.map((item) => {
                                    const when = new Date(item.scheduledDate);
                                    const overdue = when < now;
                                    return (
                                        <Tr key={item.id}>
                                            <Td whiteSpace="nowrap">
                                                <div className="font-semibold">
                                                    {format(when, "dd/MM/yyyy", { locale: ptBR })}
                                                </div>
                                                <div className="text-gray-600">{format(when, "HH:mm")}</div>
                                                {overdue && <Badge colorScheme="orange">Vencido</Badge>}
                                            </Td>
                                            <Td>
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-gray-500 text-xs">{item.phoneNumber}</div>
                                            </Td>
                                            <Td whiteSpace="nowrap">{formatCpf(item.idNumber)}</Td>
                                            <Td>
                                                {item.licensePlate ? (
                                                    <>
                                                        <div>{item.licensePlate}</div>
                                                        <div className="text-gray-500 text-xs">
                                                            {[item.carModel, item.color].filter(Boolean).join(" - ")}
                                                        </div>
                                                    </>
                                                ) : (
                                                    "A pé"
                                                )}
                                            </Td>
                                            <Td>{item.target}</Td>
                                            <Td>{item.contactPerson}</Td>
                                            <Td textAlign="right" whiteSpace="nowrap">
                                                <Button size="sm" colorScheme="blue" variant="outline" mr={2} onClick={() => setEditing(item)}>
                                                    Editar
                                                </Button>
                                                <Button size="sm" colorScheme="red" variant="outline" onClick={() => setDeleting(item)}>
                                                    Excluir
                                                </Button>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </div>
                )}
            </div>

            <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} size="4xl" scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Agendamento</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {editing && (
                            <ScheduleVisitorForm
                                key={editing.id}
                                toEdit={editing}
                                onCancel={() => setEditing(null)}
                                onSaved={() => {
                                    setEditing(null);
                                    load();
                                }}
                            />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            <AlertDialog isOpen={Boolean(deleting)} leastDestructiveRef={cancelRef} onClose={() => setDeleting(null)}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Excluir agendamento</AlertDialogHeader>
                        <AlertDialogBody>
                            Excluir o agendamento de <strong>{deleting?.name}</strong>
                            {deleting?.scheduledDate &&
                                ` em ${format(new Date(deleting.scheduledDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`}
                            ? Esta ação não pode ser desfeita.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setDeleting(null)} isDisabled={deletingBusy}>
                                Voltar
                            </Button>
                            <Button colorScheme="red" ml={3} onClick={handleDelete} isLoading={deletingBusy}>
                                Excluir
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    );
};

export default ManageScheduledVisitors;
