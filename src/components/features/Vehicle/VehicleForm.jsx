import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../../../services/client";
import { Button, useToast } from "@chakra-ui/react";
import FormSection from "../Visitor/FormSection";
import InputField from "../Visitor/InputField";
import QRCodeSection from "./QRCodeSection";
import ColorSelect from "../Form/ColorSelect";
import DestinationSelect from "../Form/DestinationSelect";
import { apiErrorMessage, validateFields } from "../../../utils/validation";

const VehicleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [toEdit, setToEdit] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchVehicle = async () => {
                try {
                    const response = await client.get(`/vehicles/${id}`);
                    setToEdit(response.data);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchVehicle();
        }
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const errors = validateFields(data, {
            completeName: ["Nome completo", "name", true],
            tagName: ["P/G - Nome de guerra", "text", true],
            driverLicense: ["Habilitação", "cnh", false],
            idNumber: ["CPF", "cpf", true],
            carModel: ["Modelo", "text", true],
            licensePlate: ["Placa", "plate", true],
            color: ["Cor", "text", true],
            company: ["Esquadrão", "text", false],
            section: ["Seção", "text", false],
        });
        if (errors.length > 0) {
            toast({ title: "Verifique os dados", description: errors.join(" • "), status: "error", duration: 6000, isClosable: true });
            return;
        }

        setIsLoading(true);
        try {
            if (id) {
                await client.patch(`/vehicles/${id}`, data);
            } else {
                const response = await client.post("/vehicles", data);
                navigate(`/veiculos/${response.data.id}`, { replace: true });
            }
            toast({
                title: "Veículo Salvo",
                description: "Os dados do veículo foram salvos com sucesso.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Erro ao Salvar",
                description: apiErrorMessage(error, "Não foi possível salvar os dados do veículo. Tente novamente."),
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            {/* key remonta o form quando os dados chegam: o InputMask ignora mudanças em defaultValue */}
            <form key={toEdit.id ?? "new"} onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormSection title="Dados Pessoais">
                        <InputField
                            id="completeName"
                            name="completeName"
                            label="Nome Completo"
                            defaultValue={toEdit.completeName}
                            maxLength="150"
                            required
                        />
                        <InputField
                            id="tagName"
                            name="tagName"
                            label="P/G - Nome de Guerra"
                            defaultValue={toEdit.tagName}
                            maxLength="100"
                            required
                        />
                        <InputField
                            id="driverLicense"
                            name="driverLicense"
                            label="Habilitação (CNH)"
                            mask="99999999999"
                            maskChar={null}
                            inputMode="numeric"
                            placeholder="11 dígitos"
                            defaultValue={toEdit.driverLicense}
                        />
                        <InputField
                            id="idNumber"
                            name="idNumber"
                            label="CPF do Militar"
                            mask="999.999.999-99"
                            inputMode="numeric"
                            defaultValue={toEdit.idNumber}
                            required
                        />
                    </FormSection>

                    <FormSection title="Dados do Veículo">
                        <InputField
                            id="carModel"
                            name="carModel"
                            label="Modelo do veículo"
                            defaultValue={toEdit.carModel}
                            maxLength="50"
                            required
                        />
                        <InputField
                            id="licensePlate"
                            name="licensePlate"
                            label="Placa do Veículo"
                            placeholder="ABC1D23"
                            maxLength="8"
                            className="uppercase"
                            defaultValue={toEdit.licensePlate}
                            required
                        />
                        <ColorSelect defaultValue={toEdit.color} required />
                    </FormSection>

                    <FormSection title="Dados da Seção">
                        <InputField
                            id="company"
                            name="company"
                            label="Esqd"
                            maxLength="10"
                            defaultValue={toEdit.company}
                        />
                        <DestinationSelect defaultValue={toEdit.section} />
                    </FormSection>
                </div>
                <div className="flex items-center justify-end mt-8 pt-4 border-t">
                    <Button
                        type="submit"
                        colorScheme="red"
                        isLoading={isLoading}
                        loadingText="Salvando..."
                    >
                        {id ? "Salvar Alterações" : "Cadastrar Veículo"}
                    </Button>
                </div>
            </form>
            <QRCodeSection vehicleId={id} />
        </div>
    );
};

export default VehicleForm;