import React from "react";
import { Image, Box, Text } from "@chakra-ui/react";
import { getAssetUrl } from "../../services/api-config";

const VisitorImage = ({ imagePath, alt = "Foto do usuario" }) => {
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

    const imageUrl = getAssetUrl(imagePath);

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
