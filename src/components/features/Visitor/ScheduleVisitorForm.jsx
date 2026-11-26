import { useNavigate } from "react-router-dom";
import { useState } from "react";
import client from "../../../services/client";
import { Button, Checkbox, useToast } from "@chakra-ui/react";
import FormSection from "./FormSection";
import InputField from "./InputField";
import ColorSelect from "../Form/ColorSelect";
import DestinationSelect from "../Form/DestinationSelect";
import { apiErrorMessage, formatCpf, validateFields } from "../../../utils/validation";
import { localDateInput, localTimeInput } from "../../../utils/dates";

// Cria um agendamento ou, com `toEdit`, edita um agendamento pendente.
// No modo edição chama `onSaved` em vez de navegar.
const ScheduleVisitorForm = ({ toEdit = null, onSaved, onCancel }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const isEdit = Boolean(toEdit);
    const scheduledAt = toEdit?.scheduledDate ? new Date(toEdit.scheduledDate) : null;
    const [isLoading, setIsLoading] = useState(false);
    const [onFoot, setOnFoot] = useState(isEdit && !toEdit.licensePlate);

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
        } else if (scheduledDate <= new Date()) {
            errors.unshift("A data e hora do agendamento deve ser futura");
        }
        if (errors.length > 0) {
            toast({ title: "Verifique os dados", description: errors.join(" • "), status: "error", duration: 6000, isClosable: true });
            return;
        }

        const payload = { ...data, onFoot, scheduledDate: scheduledDate.toISOString() };
        setIsLoading(true);
        try {
            if (isEdit) {
                const response = await client.put(`/entries/scheduled/${toEdit.id}`, payload);
                toast({ title: "Agendamento atualizado", status: "success", duration: 3000, isClosable: true });
                onSaved?.(response.data?.agendamento);
            } else {
                await client.post("/entries/schedule", payload);
                toast({
                    title: "Agendamento Realizado",
                    description: "O visitante foi agendado com sucesso.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate("/", { replace: true });
            }
        } catch (error) {
            toast({
                title: isEdit ? "Erro ao atualizar" : "Erro no Agendamento",
                description: apiErrorMessage(error, "Não foi possível salvar o agendamento. Tente novamente."),
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
            {!isEdit && (
                <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4" role="alert">
                    <p className="font-bold">Atenção</p>
                    <p>A foto do visitante será capturada pela guarda no momento da entrada.</p>
                </div>
            )}

            <FormSection title="Dados do Agendamento">
                <InputField
                    id="scheduleDate"
                    name="scheduleDate"
                    label="Data"
                    type="date"
                    required
                    min={localDateInput()}
                    defaultValue={scheduledAt ? localDateInput(scheduledAt) : undefined}
                />
                <InputField
                    id="scheduleTime"
                    name="scheduleTime"
                    label="Hora"
                    type="time"
                    required
                    defaultValue={scheduledAt ? localTimeInput(scheduledAt) : undefined}
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
                    defaultValue={toEdit?.name}
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
                    defaultValue={toEdit ? formatCpf(toEdit.idNumber) : undefined}
                />
                <InputField
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Telefone"
                    mask="(99) 99999-9999"
                    placeholder="(11) 99999-9999"
                    title="Digite um telefone válido (DD) 9XXXX-XXXX"
                    required
                    defaultValue={toEdit?.phoneNumber || undefined}
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
                            defaultValue={toEdit?.carModel || undefined}
                        />
                        <InputField
                            id="licensePlate"
                            name="licensePlate"
                            label="Placa"
                            placeholder="ABC1234 ou ABC1D23"
                            maxLength="8"
                            className="uppercase"
                            required
                            defaultValue={toEdit?.licensePlate || undefined}
                        />
                        <ColorSelect required defaultValue={toEdit?.color || ""} />
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
                    defaultValue={toEdit?.contactPerson || undefined}
                />
                <DestinationSelect
                    id="target"
                    name="target"
                    label="Seção de Destino"
                    required
                    defaultValue={toEdit?.target || ""}
                    className="md:col-span-2"
                />
            </FormSection>

            <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t">
                {isEdit && (
                    <Button variant="outline" onClick={onCancel} isDisabled={isLoading}>
                        Cancelar
                    </Button>
                )}
                <Button
                    type="submit"
                    colorScheme="red"
                    isLoading={isLoading}
                    loadingText={isEdit ? "Salvando..." : "Agendando..."}
                >
                    {isEdit ? "Salvar Alterações" : "Agendar Visitante"}
                </Button>
            </div>
        </form>
    );
};

export default ScheduleVisitorForm;
