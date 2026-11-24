import { useNavigate } from "react-router-dom";
import { useState } from "react";
import client from "../../../services/client";
import { Button, Checkbox, useToast } from "@chakra-ui/react";
import FormSection from "./FormSection";
import InputField from "./InputField";
import ColorSelect from "../Form/ColorSelect";
import { useDestinations } from "../../../hooks/useDestinations";
import { apiErrorMessage, validateFields } from "../../../utils/validation";

const ScheduleVisitorForm = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [onFoot, setOnFoot] = useState(false);
    const { destinations, loading: loadingDestinations } = useDestinations();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const { scheduleDate, scheduleTime, ...data } = Object.fromEntries(formData.entries());

        const errors = validateFields(data, {
            name: ["Nome", "name", true],
            idNumber: ["CPF", "cpf", true],
            phoneNumber: ["Telefone", "text", true],
            contactPerson: ["Contato", "text", true],
            target: ["Seção de destino", "text", true],
            ...(onFoot
                ? {}
                : {
                      carModel: ["Modelo", "text", true],
                      licensePlate: ["Placa", "plate", true],
                      color: ["Cor", "text", true],
                  }),
        });
        const scheduledDate = new Date(`${scheduleDate}T${scheduleTime}`);
        if (!scheduleDate || !scheduleTime || isNaN(scheduledDate.getTime())) {
            errors.unshift("Informe data e hora do agendamento");
        }
        if (errors.length > 0) {
            toast({ title: "Verifique os dados", description: errors.join(" • "), status: "error", duration: 6000, isClosable: true });
            return;
        }

        setIsLoading(true);
        try {
            await client.post("/entries/schedule", {
                ...data,
                onFoot,
                scheduledDate: scheduledDate.toISOString(),
            });
            toast({
                title: "Agendamento Realizado",
                description: "O visitante foi agendado com sucesso.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/", { replace: true });
        } catch (error) {
            toast({
                title: "Erro no Agendamento",
                description: apiErrorMessage(error, "Não foi possível realizar o agendamento. Tente novamente."),
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4" role="alert">
                <p className="font-bold">Atenção</p>
                <p>A foto do visitante será capturada pela guarda no momento da entrada.</p>
            </div>

            <FormSection title="Dados do Agendamento">
                <InputField
                    id="scheduleDate"
                    name="scheduleDate"
                    label="Data"
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                />
                <InputField
                    id="scheduleTime"
                    name="scheduleTime"
                    label="Hora"
                    type="time"
                    required
                />
            </FormSection>

            <FormSection title="Dados Pessoais">
                <InputField
                    id="name"
                    name="name"
                    label="Nome Completo"
                    placeholder="Nome completo do visitante"
                    maxLength="150"
                    className="capitalize md:col-span-2"
                    required
                />
                <InputField
                    id="idNumber"
                    name="idNumber"
                    label="CPF"
                    mask="999.999.999-99"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    title="Digite um CPF válido (000.000.000-00)"
                    required
                />
                <InputField
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Telefone"
                    mask="(99) 99999-9999"
                    placeholder="(11) 99999-9999"
                    title="Digite um telefone válido (DD) 9XXXX-XXXX"
                    required
                />
            </FormSection>

            <FormSection title="Dados do Veículo">
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                    <Checkbox
                        isChecked={onFoot}
                        onChange={(event) => setOnFoot(event.target.checked)}
                        colorScheme="red"
                        size="lg"
                    >
                        A pé (sem veículo)
                    </Checkbox>
                </div>
                {!onFoot && (
                    <>
                        <InputField
                            id="carModel"
                            name="carModel"
                            label="Modelo"
                            maxLength="50"
                            required
                        />
                        <InputField
                            id="licensePlate"
                            name="licensePlate"
                            label="Placa"
                            placeholder="ABC1234 ou ABC1D23"
                            maxLength="8"
                            className="uppercase"
                            required
                        />
                        <ColorSelect required />
                    </>
                )}
            </FormSection>

            <FormSection title="Dados do Destino">
                <InputField
                    id="contactPerson"
                    name="contactPerson"
                    label="Contato"
                    maxLength="100"
                    required
                />
                <div className="md:col-span-2">
                    <label htmlFor="target" className="block text-sm font-medium text-gray-700">Seção de Destino</label>
                    <select
                        name="target"
                        id="target"
                        required
                        disabled={loadingDestinations}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
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
            </FormSection>

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
    );
};

export default ScheduleVisitorForm;