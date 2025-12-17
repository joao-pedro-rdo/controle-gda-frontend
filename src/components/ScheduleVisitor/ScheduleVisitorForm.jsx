import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InputMask from "react-input-mask";
import client from "../../services/client";
import { Button, useToast } from "@chakra-ui/react";

const ScheduleVisitorForm = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        const scheduleDate = formData.get("scheduleDate");
        const scheduleTime = formData.get("scheduleTime");

        if (!scheduleDate || !scheduleTime) {
            toast({
                title: "Erro de Validação",
                description: "Por favor, preencha data e hora do agendamento.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
            return;
        }

        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

        if (scheduledDateTime <= new Date()) {
            toast({
                title: "Erro de Validação",
                description: "A data e hora do agendamento deve ser futura.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
            return;
        }

        const data = {
            isVisitor: true,
            isScheduled: true,
            scheduledDate: scheduledDateTime.toISOString(),
            name: formData.get("completeName"),
            idNumber: formData.get("idNumber"),
            phoneNumber: formData.get("phoneNumber"),
            licensePlate: formData.get("licensePlate"),
            carModel: formData.get("carModel"),
            color: formData.get("color"),
            contactPerson: formData.get("contactPerson"),
            target: formData.get("section"),
            type: "Entrada",
        };

        try {
            await client.post("/entries/schedule", data);
            toast({
                title: "Agendamento Realizado",
                description: "O visitante foi agendado com sucesso.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Erro ao agendar visitante:", error);
            toast({
                title: "Erro no Agendamento",
                description: "Não foi possível realizar o agendamento. Tente novamente.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4" role="alert">
                    <p className="font-bold">Atenção</p>
                    <p>A foto do visitante será capturada pela guarda no momento da entrada.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Dados do Agendamento */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Dados do Agendamento</h2>
                    </div>
                    <div>
                        <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700">Data</label>
                        <input
                            type="date"
                            name="scheduleDate"
                            id="scheduleDate"
                            required
                            min={new Date().toISOString().split("T")[0]}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700">Hora</label>
                        <input
                            type="time"
                            name="scheduleTime"
                            id="scheduleTime"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    {/* Dados Pessoais */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Dados Pessoais</h2>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="completeName" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input
                            type="text"
                            name="completeName"
                            id="completeName"
                            placeholder="Nome completo do visitante"
                            pattern="[A-Za-zÀ-ÿ\s]{3,}"
                            title="Nome deve ter pelo menos 3 caracteres"
                            minLength="3"
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
                            placeholder="000.000.000-00"
                            title="Digite um CPF válido (000.000.000-00)"
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
                            placeholder="(11) 99999-9999"
                            title="Digite um telefone válido (DD) 9XXXX-XXXX"
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
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">Placa</label>
                        <input
                            type="text"
                            name="licensePlate"
                            id="licensePlate"
                            placeholder="ABC-1234 ou ABC1D23"
                            pattern="[A-Z]{3}-?[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2}"
                            title="Digite uma placa brasileira válida"
                            maxLength="8"
                            className="uppercase mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700">Cor</label>
                        <input
                            type="text"
                            name="color"
                            id="color"
                            required
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
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="section" className="block text-sm font-medium text-gray-700">Seção de Destino</label>
                        <select
                            name="section"
                            id="section"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">Selecione...</option>
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
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-end mt-8 pt-4 border-t">
                    <Button
                        type="submit"
                        colorScheme="red"
                        isLoading={isLoading}
                        loadingText="Agendando..."
                    >
                        Agendar Visitante
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ScheduleVisitorForm;
