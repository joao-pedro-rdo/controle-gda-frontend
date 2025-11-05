import React, { useState, useRef } from 'react';
import { Box, Button, Image, Flex, Text, useToast } from '@chakra-ui/react';
import Webcam from 'react-webcam';
import client from '../services/client.js';

function ImageCapture({ onImageCapture, showImportFromSystem = true }) {
    const [preview, setPreview] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Para o botão de importar
    const fileInputRef = useRef(null);
    const webcamRef = useRef(null);
    const toast = useToast();

    // Função para lidar com upload de arquivos
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleCaptureOrSelect(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Função para capturar foto da webcam
    const capturePhoto = () => {
        // Configuramos para capturar a imagem em alta qualidade
        const imageSrc = webcamRef.current.getScreenshot({
            width: 1280,
            height: 720
        });
        handleCaptureOrSelect(imageSrc);
    };

    // Função para importar foto do sistema de vigilância
    const importFromSurveillance = async () => {
        try {
            setIsLoading(true);
            // Substitua esta URL pela API real do seu sistema de vigilância
            const response = await client.get('/surveillance/latest-photo');

            if (response.data && response.data.imageBase64) {
                setPreview(response.data.imageBase64);
                onImageCapture(response.data.imageBase64);

                toast({
                    title: "Foto importada",
                    description: "Foto do sistema de vigilância importada com sucesso",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error("Imagem não disponível");
            }
        } catch (error) {
            console.error("Erro ao importar imagem:", error);
            toast({
                title: "Erro",
                description: "Não foi possível importar a foto do sistema de vigilância",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Configurações melhoradas para a webcam
    const videoConstraints = {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: "user",
        aspectRatio: 4 / 3
    };

    // Atualize a função onImageCapture para passar o preview (base64)
    const handleCaptureOrSelect = (base64Image) => {
        setPreview(base64Image);
        onImageCapture(base64Image); // Chama a função passada pelo pai
        setShowCamera(false); // Fecha a câmera se estava aberta
    };

    return (
        <Box width="100%">
            {/* Área de preview da imagem */}
            {preview ? (
                <Box mb={3} display="flex" justifyContent="center">
                    <Image
                        src={preview}
                        alt="Foto preview"
                        width="180px"
                        height="240px"
                        objectFit="cover"
                        borderRadius="md"
                    />
                </Box>
            ) : showCamera ? (
                <Box mb={3} position="relative">
                    {/* Modal da câmera com tamanho aumentado */}
                    <Box
                        border="2px dashed"
                        borderColor="gray.300"
                        borderRadius="md"
                        p={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        width="100%" // Ajustar para responsividade
                        maxWidth="480px" // Limitar largura máxima
                        margin="0 auto"
                    >
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            width="100%"
                            height="auto"
                            style={{ borderRadius: '4px' }}
                        />
                        <Flex mt={3} justifyContent="center" gap={3}>
                            <Button
                                colorScheme="green"
                                onClick={capturePhoto}
                                size="md"
                            >
                                Tirar Foto
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={() => setShowCamera(false)}
                                size="md"
                            >
                                Cancelar
                            </Button>
                        </Flex>
                    </Box>
                </Box>
            ) : (
                <Box
                    mb={3}
                    width="180px"
                    height="240px"
                    bg="gray.100"
                    borderRadius="md"
                    margin="0 auto"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="gray.500"
                    border="1px dashed gray.300"
                >
                    <Text textAlign="center">Sem foto</Text>
                </Box>
            )}

            {/* Botões para interação */}
            <Flex justifyContent="center" gap={2} wrap="wrap" mt={2}>
                {!showCamera && (
                    <>
                        <Button
                            colorScheme="blue"
                            onClick={() => setShowCamera(true)}
                            size="sm"
                        >
                            Abrir Câmera
                        </Button>
                        <Button
                            colorScheme="teal"
                            onClick={() => fileInputRef.current.click()}
                            size="sm"
                        >
                            Selecionar Imagem
                        </Button>
                        {showImportFromSystem && ( // Renderiza condicionalmente
                            <Button
                                colorScheme="purple"
                                onClick={importFromSurveillance}
                                isLoading={isLoading}
                                loadingText="Importando..."
                                size="sm"
                            >
                                Importar do Sistema
                            </Button>
                        )}
                        {preview && (
                            <Button
                                colorScheme="red"
                                onClick={() => {
                                    setPreview(null);
                                    onImageCapture(null); // Informa ao pai que a imagem foi removida
                                }}
                                size="sm"
                            >
                                Remover
                            </Button>
                        )}
                    </>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                handleCaptureOrSelect(reader.result);
                            };
                            reader.readAsDataURL(file);
                        }
                        e.target.value = null; // Para permitir selecionar o mesmo arquivo novamente
                    }}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
            </Flex>
        </Box>
    );
}

export default ImageCapture;