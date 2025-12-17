import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import client from "../../../services/client";
import InputMask from "react-input-mask";
import { Button, useToast, Alert, AlertIcon, Box } from "@chakra-ui/react";
import ImageCapture from "./ImageCapture"; // Assuming ImageCapture is in the same folder
import { useDestinations } from "../../../hooks/useDestinations";

const VisitorForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const toast = useToast();
    const { destinations, loading: loadingDestinations } = useDestinations();

    const [isLoading, setIsLoading] = useState(false);
    const [scheduledVisitor, setScheduledVisitor] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);

    useEffect(() => {
        if (location.state?.scheduledVisitor) {
            setScheduledVisitor(location.state.scheduledVisitor);
        }
    }, [location.state]);

    const handleImageCapture = (base64) => {
        setImageBase64(base64);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const submitData = new FormData();
        Object.keys(data).forEach(key => submitData.append(key, data[key]));

        if (imageBase64) {
            const blob = await fetch(imageBase64).then(res => res.blob());
            submitData.append("image", blob, "visitor.jpg");
        }

        try {
            if (scheduledVisitor?.id) {
                await client.patch(`/entries/scheduled/${scheduledVisitor.id}/confirm`, submitData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await client.post("/entries", submitData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            toast({
                title: "Registro Salvo",
                description: "A entrada do visitante foi registrada com sucesso.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Erro ao registrar visitante:", error);
            toast({
                title: "Erro ao Salvar",
                description: "Não foi possível registrar a entrada. Tente novamente.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            {scheduledVisitor && (
                <Alert status="info" mb="6" rounded="md">
                    <AlertIcon />
                    <Box flex="1">
                        <strong>Confirmando agendamento:</strong> {scheduledVisitor.name}
                        <br />
                        <small>Agendado para: {new Date(scheduledVisitor.scheduledDate).toLocaleString("pt-BR")}</small>
                    </Box>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Dados Pessoais */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Dados Pessoais</h2>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="completeName" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input
                        type="text"
                        name="completeName"
                        id="completeName"
                        defaultValue={scheduledVisitor?.name}
                        className="capitalize mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">CPF</label>
                    <InputMask
                        mask="999.999.999-99"
                        name="idNumber"
                        id="idNumber"
                        defaultValue={scheduledVisitor?.idNumber}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Telefone</label>
                    <InputMask
                        mask="(99) 99999-9999"
                        name="phoneNumber"
                        id="phoneNumber"
                        defaultValue={scheduledVisitor?.phoneNumber}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        required
                    />
                </div>

                {/* Dados do Veículo */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Dados do Veículo</h2>
                </div>
                <div>
                    <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">Modelo</label>
                    <input
                        type="text"
                        name="carModel"
                        id="carModel"
                        defaultValue={scheduledVisitor?.carModel}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                    />
                </div>
                <div>
                    <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">Placa</label>
                    <input
                        type="text"
                        name="licensePlate"
                        id="licensePlate"
                        defaultValue={scheduledVisitor?.licensePlate}
                        className="uppercase mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                    />
                </div>
                <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">Cor</label>
                    <input
                        type="text"
                        name="color"
                        id="color"
                        defaultValue={scheduledVisitor?.color}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                    />
                </div>

                {/* Dados do Destino */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Dados do Destino</h2>
                </div>
                <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contato</label>
                    <input
                        type="text"
                        name="contactPerson"
                        id="contactPerson"
                        defaultValue={scheduledVisitor?.contactPerson}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        required
                    />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="section" className="block text-sm font-medium text-gray-700">Seção de Destino</label>
                    <select
                        name="section"
                        id="section"
                        defaultValue={scheduledVisitor?.target}
                        disabled={loadingDestinations}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                        required
                    >
                        <option value="">
                            {loadingDestinations ? 'Carregando...' : 'Selecione...'}
                        </option>
                        {destinations.map((dest) => (
                            <option key={dest} value={dest}>
                                {dest}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Captura de Imagem */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Foto do Visitante</h2>
                    <ImageCapture onImageCapture={handleImageCapture} />
                </div>
            </div>

            <div className="flex items-center justify-end mt-8 pt-4 border-t">
                <Button
                    type="submit"
                    colorScheme="red"
                    isLoading={isLoading}
                    loadingText="Salvando..."
                >
                    {scheduledVisitor ? "Confirmar Entrada" : "Registrar Entrada"}
                </Button>
            </div>
        </form>
    );
};

export default VisitorForm;