import { useNavigate } from "react-router-dom";
import { useState } from "react";
import client from "../../../services/client";
import { Button, useToast } from "@chakra-ui/react";
import FormSection from "./FormSection";
import InputField from "./InputField";

const ScheduleVisitorForm = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

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
        <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
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
                    id="completeName"
                    name="completeName"
                    label="Nome Completo"
                    placeholder="Nome completo do visitante"
                    pattern="[A-Za-zÀ-ÿ\s]{3,}"
                    title="Nome deve ter pelo menos 3 caracteres"
                    minLength="3"
                    className="capitalize md:col-span-2"
                    required
                />
                <InputField
                    id="idNumber"
                    name="idNumber"
                    label="CPF"
                    mask="999.999.999-99"
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
                <InputField
                    id="carModel"
                    name="carModel"
                    label="Modelo"
                />
                <InputField
                    id="licensePlate"
                    name="licensePlate"
                    label="Placa"
                    placeholder="ABC-1234 ou ABC1D23"
                    pattern="[A-Z]{3}-?[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2}"
                    title="Digite uma placa brasileira válida"
                    maxLength="8"
                    className="uppercase"
                />
                <InputField
                    id="color"
                    name="color"
                    label="Cor"
                />
            </FormSection>

            <FormSection title="Dados do Destino">
                <InputField
                    id="contactPerson"
                    name="contactPerson"
                    label="Contato"
                    required
                />
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