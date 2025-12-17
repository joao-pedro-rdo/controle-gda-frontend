import React, { useState, useRef, useCallback } from "react";
import {
    Box,
    Button,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";

export const PhotoCapture = ({ onImageCapture }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Erro ao acessar câmera:", error);
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    }, []);

    const handleOpen = () => {
        onOpen();
        startCamera();
    };

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context.drawImage(video, 0, 0);

            const imageData = canvas.toDataURL("image/jpeg", 0.8);
            onImageCapture(imageData);
            handleClose();
        }
    };

    return (
        <Box>
            <Button colorScheme="blue" onClick={handleOpen}>
                Capturar Foto
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Capturar Foto</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Box>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                                />
                                <canvas ref={canvasRef} style={{ display: "none" }} />
                            </Box>
                            <Button colorScheme="green" onClick={capturePhoto}>
                                Tirar Foto
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};