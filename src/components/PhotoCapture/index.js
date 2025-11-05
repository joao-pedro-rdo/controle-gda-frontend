// Arquivo: front/src/components/PhotoCapture/index.js
// Se não existir, usar o mesmo do VisitorForm

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

export const PhotoCapture = ({ onImageCapture }) => {
  const [stream, setStream] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const startCamera = async () => {
    try {
      setCapturing(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      onOpen();
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      setCapturing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturing(false);
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
      stopCamera();
    }
  };

  return (
    <Box>
      <Button colorScheme="blue" onClick={startCamera} disabled={capturing}>
        {capturing ? "Abrindo câmera..." : "Capturar Foto"}
      </Button>

      <Modal isOpen={isOpen} onClose={stopCamera} size="lg">
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
                Capturar
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
