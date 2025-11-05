import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import styled from 'styled-components';

const CamBox = styled.div`
  width: 400px;
  max-width: 90%;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    width: 300px;
  }
`;

const QRCodeInput = ({ onScan, onError, showRawData = false }) => {
    const [qrScanner, setQrScanner] = useState(null);
    const [isFacingUser, setIsFacingUser] = useState(false);
    const qrBoxRef = useRef(null);
    const toast = useToast();
    const qrScannerIdRef = useRef('qr-reader-' + Math.random().toString(36).substring(2, 15));
    const lastErrorToastRef = useRef(0);
    const scannerInitializedRef = useRef(false);

    useEffect(() => {
        // Verificar se o navegador suporta as APIs necessárias
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToastWithThrottle({
                title: "Navegador incompatível",
                description: "Seu navegador não suporta acesso à câmera. Tente usar um navegador moderno como Chrome ou Firefox.",
                status: "error",
                duration: 8000,
                isClosable: true,
            });
            onError(new Error("Browser not supported"));
        }
    }, []);

    useEffect(() => {
        const startScanner = async () => {
            try {
                if (qrScanner) {
                    // Parar o scanner existente antes de iniciar um novo
                    await qrScanner.stop().catch(e => console.log("Erro ao parar scanner:", e));
                    qrScanner.clear();
                    // Pequena pausa para garantir que recursos sejam liberados
                    await new Promise(resolve => setTimeout(resolve, 300));
                }

                const config = {
                    fps: 5,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    showTorchButtonIfSupported: true,
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                    disableFlip: false,
                    verbose: false  // Desativar logs verbosos
                };

                const html5QrCode = new Html5Qrcode(qrScannerIdRef.current);
                setQrScanner(html5QrCode);

                const facingMode = isFacingUser ? "user" : "environment";

                await html5QrCode.start(
                    { facingMode },
                    config,
                    handleQrCodeSuccess,
                    handleQrCodeError
                );

                scannerInitializedRef.current = true;

                showToastWithThrottle({
                    title: "Câmera ativada",
                    description: "Aponte para um QR Code para escanear",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (err) {
                console.error("Erro ao iniciar scanner:", err);

                showToastWithThrottle({
                    title: "Erro na câmera",
                    description: "Verifique se você permitiu o acesso à câmera",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });

                onError(err);
            }
        };

        startScanner();

        return () => {
            if (qrScanner) {
                qrScanner
                    .stop()
                    .then(() => {
                        scannerInitializedRef.current = false;
                    })
                    .catch(err => console.error("Erro ao parar scanner:", err));
            }
        };
    }, [isFacingUser]);

    const showToastWithThrottle = (toastOptions) => {
        const now = Date.now();
        if (now - lastErrorToastRef.current > 5000) {
            lastErrorToastRef.current = now;
            toast(toastOptions);
        }
    };

    const handleQrCodeSuccess = (decodedText) => {
        try {
            // Se showRawData estiver habilitado, vamos mostrar o texto bruto
            const result = JSON.parse(decodedText);

            // Chamar onScan com o objeto parseado e o texto bruto
            onScan(result, decodedText);
        } catch (error) {
            // Se não conseguir parsear, mostrar o erro e o texto bruto para depuração
            console.log("Texto QR bruto:", decodedText);

            if (showRawData) {
                // Chamar onScan apenas com o texto bruto (não parseado)
                onScan(null, decodedText);
            }

            showToastWithThrottle({
                title: "QR Code inválido",
                description: "Formato de QR Code não reconhecido",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleQrCodeError = (error) => {
        // Verificar se o erro é apenas uma mensagem de diagnóstico normal da biblioteca
        if (!scannerInitializedRef.current ||
            error?.name === "NotReadableError" ||
            error?.name === "OverconstrainedError" ||
            error?.name === "NotFoundException" || // Common error when no QR code is found in frame
            // Adicionar mais padrões para filtrar todas as variantes dessa mensagem
            error?.message?.includes("MultiFormat Readers") ||
            error?.message?.includes("QR code parse error") ||
            error?.message?.includes("No MultiFormat Readers were able to detect") ||
            error?.message?.includes("No barcode or QR code detected")) {
            return;
        }

        // Apenas erros realmente críticos vão chegar aqui
        //console.error("Erro crítico na leitura do QR code:", error);

        // Usar throttling para evitar mensagens repetitivas
        // showToastWithThrottle({
        //     title: "Erro na câmera",
        //     description: "Ocorreu um problema com o scanner QR",
        //     status: "error",
        //     duration: 5000,
        //     isClosable: true,
        // });

        onError(error);
    };

    const toggleCamera = async () => {
        if (qrScanner) {
            await qrScanner.stop();
            scannerInitializedRef.current = false;
        }

        setIsFacingUser(!isFacingUser);
    };

    return (
        <Box>
            <CamBox ref={qrBoxRef}>
                <div id={qrScannerIdRef.current} style={{ width: '100%' }} />
                <Text textAlign="center" mt={2} color="green.500">
                    Escaneamento ativo - posicione o QR Code na área acima
                </Text>
            </CamBox>
            <Flex justify="center" mb={4}>
                <Button
                    onClick={toggleCamera}
                    colorScheme="blue"
                    size="sm"
                >
                    Alternar Câmera
                </Button>
            </Flex>
        </Box>
    );
};

export default QRCodeInput;