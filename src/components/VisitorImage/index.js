import React from "react";
import { Image, Box, Text } from "@chakra-ui/react";

const VisitorImage = ({ imagePath, alt = "Foto do usuário" }) => {
    if (!imagePath) {
        return (
            <Box
                width="60px"
                height="80px"
                bg="gray.100"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid"
                borderColor="gray.300"
            >
                <Text fontSize="xs" color="gray.500" textAlign="center">
                    Sem foto
                </Text>
            </Box>
        );
    }

    // Construir a URL completa da imagem
    const imageUrl = imagePath.startsWith('http')
        ? imagePath
        : `${process.env.REACT_APP_API_URL}${imagePath}`;

    return (
        <Image
            src={imageUrl}
            alt={alt}
            width="60px"
            height="80px"
            objectFit="cover"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.300"
            fallback={
                <Box
                    width="60px"
                    height="80px"
                    bg="gray.100"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="1px solid"
                    borderColor="gray.300"
                >
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                        Erro ao carregar
                    </Text>
                </Box>
            }
        />
    );
};

export default VisitorImage;