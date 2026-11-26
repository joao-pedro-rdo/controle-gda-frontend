import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import client from "../../../services/client";
import InputMask from "react-input-mask";
import { Button, Checkbox, useToast, Alert, AlertIcon, Box } from "@chakra-ui/react";
import ImageCapture from "./ImageCapture";
import ColorSelect from "../Form/ColorSelect";
import DestinationSelect from "../Form/DestinationSelect";
import { apiErrorMessage, digitsOnly, isValidCpf, validateFields } from "../../../utils/validation";

const inputClass =
    "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500";

const VisitorForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [scheduledVisitor, setScheduledVisitor] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [onFoot, setOnFoot] = useState(false);

    // Autopreenchimento pela última visita com o mesmo CPF.
    const formRef = useRef(null);
    const lastLookupRef = useRef("");
    const [prefill, setPrefill] = useState({});
    const [prefillKey, setPrefillKey] = useState(0);
    const [lookup, setLookup] = useState({ status: "idle" });

    useEffect(() => {
        const visitor = location.state?.scheduledVisitor;
        if (visitor) {
            setScheduledVisitor(visitor);
            setOnFoot(!visitor.licensePlate);
        }
    }, [location.state]);

    const fieldValue = (name) => formRef.current?.elements.namedItem(name)?.value?.trim() ?? "";

    // Ao completar um CPF válido, busca a visita mais recente e preenche só
    // os campos ainda vazios. Tudo continua editável; a foto é sempre nova.
    const handleCpfChange = async (event) => {
        const cpf = digitsOnly(event.target.value);
        if (scheduledVisitor || cpf.length !== 11 || !isValidCpf(cpf) || cpf === lastLookupRef.current) return;
        lastLookupRef.current = cpf;
        setLookup({ status: "loading" });
        try {
            const { data } = await client.get(`/entries/visitor-lookup/${cpf}`);
            const visitor = data.visitor;
            if (!visitor || lastLookupRef.current !== cpf) {
                setLookup({ status: visitor ? "idle" : "notfound" });
                return;
            }
            const keep = (name, value) => fieldValue(name) || value || "";
            const withVehicle = !onFoot && Boolean(visitor.licensePlate);
            setPrefill({
                name: keep("name", visitor.name),
                phoneNumber: keep("phoneNumber", visitor.phoneNumber),
                ...(withVehicle && {
                    carModel: keep("carModel", visitor.carModel),
                    licensePlate: keep("licensePlate", visitor.licensePlate),
                    color: keep("color", visitor.color),
                }),
            });
            // Última visita a pé: marca "A pé", salvo se a Guarda já começou a
            // preencher o veículo. Pode ser desmarcado se agora veio de carro.
            const typedVehicle = ["carModel", "licensePlate", "color"].some((name) => fieldValue(name));
            const markOnFoot = !visitor.licensePlate && !onFoot && !typedVehicle;
            if (markOnFoot) setOnFoot(true);
            setPrefillKey((key) => key + 1);
            setLookup({ status: "found", lastVisit: visitor.lastVisit, onFoot: markOnFoot });
        } catch {
            // Falha na busca não impede o cadastro manual.
            setLookup({ status: "idle" });
        }
    };

    const showError = (description) =>
        toast({ title: "Verifique os dados", description, status: "error", duration: 6000, isClosable: true });

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

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
        if (!imageBase64 && !scheduledVisitor?.imagePath) {
            errors.push("Capture ou envie a foto do visitante");
        }
        if (errors.length > 0) {
            showError(errors.join(" • "));
            return;
        }

        setIsLoading(true);
        const submitData = new FormData();
        Object.entries(data).forEach(([key, value]) => submitData.append(key, value));
        submitData.append("type", "Entrada");
        submitData.append("isVisitor", "true");
        submitData.append("onFoot", String(onFoot));

        if (imageBase64) {
            const blob = await fetch(imageBase64).then((res) => res.blob());
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
            toast({
                title: "Erro ao Salvar",
                description: apiErrorMessage(error, "Não foi possível registrar a entrada. Tente novamente."),
                status: "error",
                duration: 6000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            ref={formRef}
            key={scheduledVisitor?.id ?? "new"}
            onSubmit={handleSubmit}
            noValidate
            className="bg-white shadow-sm border border-gray-200 rounded-lg p-6"
        >
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
                <div>
                    <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">CPF</label>
                    <InputMask
                        mask="999.999.999-99"
                        name="idNumber"
                        id="idNumber"
                        inputMode="numeric"
                        defaultValue={scheduledVisitor?.idNumber}
                        onChange={handleCpfChange}
                        className={inputClass}
                        autoFocus={!scheduledVisitor}
                        required
                    />
                    {lookup.status === "loading" && (
                        <p className="mt-1 text-xs text-gray-500">Buscando visitas anteriores...</p>
                    )}
                    {lookup.status === "found" && (
                        <p className="mt-1 text-xs text-green-700">
                            Dados da última visita ({new Date(lookup.lastVisit).toLocaleDateString("pt-BR")}) preenchidos
                            {lookup.onFoot && ", que foi a pé"}. Confira antes de salvar.
                        </p>
                    )}
                    {lookup.status === "notfound" && (
                        <p className="mt-1 text-xs text-gray-500">Primeira visita deste CPF.</p>
                    )}
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input
                        type="text"
                        key={`name-${prefillKey}`}
                        name="name"
                        id="name"
                        maxLength={150}
                        defaultValue={prefill.name ?? scheduledVisitor?.name}
                        className={`capitalize ${inputClass}`}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Telefone</label>
                    <InputMask
                        key={`phone-${prefillKey}`}
                        mask="(99) 99999-9999"
                        name="phoneNumber"
                        id="phoneNumber"
                        inputMode="numeric"
                        defaultValue={prefill.phoneNumber ?? scheduledVisitor?.phoneNumber}
                        className={inputClass}
                        required
                    />
                </div>

                {/* Dados do Veículo */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6 flex items-center justify-between border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Dados do Veículo</h2>
                    <Checkbox
                        isChecked={onFoot}
                        onChange={(event) => setOnFoot(event.target.checked)}
                        colorScheme="red"
                        size="lg"
                    >
                        A pé (sem veículo)
                    </Checkbox>
                </div>
                {onFoot ? (
                    <p className="col-span-1 md:col-span-2 lg:col-span-4 text-sm text-gray-500">
                        Visitante a pé: os dados do veículo não serão registrados.
                    </p>
                ) : (
                    <>
                        <div>
                            <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">Modelo</label>
                            <input
                                type="text"
                                key={`model-${prefillKey}`}
                                name="carModel"
                                id="carModel"
                                maxLength={50}
                                defaultValue={prefill.carModel ?? scheduledVisitor?.carModel}
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">Placa</label>
                            <input
                                type="text"
                                name="licensePlate"
                                id="licensePlate"
                                maxLength={8}
                                key={`plate-${prefillKey}`}
                                placeholder="ABC1D23"
                                defaultValue={prefill.licensePlate ?? scheduledVisitor?.licensePlate}
                                className={`uppercase ${inputClass}`}
                                required
                            />
                        </div>
                        <ColorSelect
                            key={`color-${prefillKey}`}
                            defaultValue={prefill.color ?? scheduledVisitor?.color}
                            required
                        />
                    </>
                )}

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
                        maxLength={100}
                        defaultValue={scheduledVisitor?.contactPerson}
                        className={inputClass}
                        required
                    />
                </div>
                {/* Seções cadastradas pela S2; um destino antigo do agendamento continua aparecendo. */}
                <DestinationSelect
                    id="target"
                    name="target"
                    label="Seção de Destino"
                    required
                    defaultValue={scheduledVisitor?.target || ""}
                    className="md:col-span-2"
                />

                {/* Captura de Imagem */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Foto do Visitante</h2>
                    <ImageCapture onImageCapture={setImageBase64} />
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
