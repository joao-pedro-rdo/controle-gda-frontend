import { useState, useEffect } from "react";
import { useToast, Button, HStack, VStack, FormControl, FormLabel, Textarea } from "@chakra-ui/react";
import InputField from "../Visitor/InputField";
import ImageUpload from "./ImageUpload";

export const PessoaNaoAutorizadaForm = ({
    onClose,
    onSuccess,
    toEdit = null,
    addPerson,
    updatePerson,
}) => {
    const [imageBase64, setImageBase64] = useState("");
    const [currentImage, setCurrentImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (toEdit) {
            setCurrentImage(toEdit.imagePath);
        }
    }, [toEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const submitData = new FormData();
        Object.keys(data).forEach(key => submitData.append(key, data[key]));

        if (selectedFile) {
            submitData.append("image", selectedFile);
        } else if (imageBase64) {
            const blob = await fetch(imageBase64).then(res => res.blob());
            submitData.append("image", blob, "unauthorized.jpg");
        }

        try {
            if (toEdit?.id) {
                await updatePerson(toEdit.id, submitData);
            } else {
                await addPerson(submitData);
            }

            toast({
                title: toEdit ? "Pessoa Atualizada" : "Pessoa Cadastrada",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Erro ao salvar pessoa não autorizada:", error);
            toast({
                title: "Erro ao Salvar",
                description: "Não foi possível salvar os dados da pessoa. Tente novamente.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                    <FormLabel>Nome Completo</FormLabel>
                    <InputField
                        id="nome"
                        name="nome"
                        defaultValue={toEdit?.nome}
                        required
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>CPF</FormLabel>
                    <InputField
                        id="CPF"
                        name="CPF"
                        mask="999.999.999-99"
                        defaultValue={toEdit?.CPF}
                        required
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Identidade</FormLabel>
                    <InputField
                        id="identidade"
                        name="identidade"
                        defaultValue={toEdit?.identidade}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Observação</FormLabel>
                    <Textarea
                        name="observacao"
                        placeholder="Motivo da restrição, observações importantes..."
                        rows={4}
                        defaultValue={toEdit?.observacao}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Foto da Pessoa</FormLabel>
                    <ImageUpload
                        onFileSelect={setSelectedFile}
                        onImageCapture={setImageBase64}
                        currentImage={currentImage}
                    />
                </FormControl>

                <HStack spacing={4} justify="flex-end" pt="4">
                    <Button
                        colorScheme="gray"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        colorScheme="red"
                        isLoading={loading}
                        loadingText={toEdit ? "Atualizando..." : "Cadastrando..."}
                    >
                        {toEdit ? "Atualizar" : "Cadastrar"}
                    </Button>
                </HStack>
            </VStack>
        </form>
    );
};