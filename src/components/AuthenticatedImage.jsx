import React, { useState, useEffect } from 'react';
import { Image, Spinner, Box } from '@chakra-ui/react';
import client from '../services/client';

const AuthenticatedImage = ({
    imagePath,
    alt,
    boxSize = "150px",
    objectFit = "cover",
    borderRadius = "full",
    ...props
}) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!imagePath) {
            setLoading(false);
            setError(true);
            return;
        }

        const loadImage = async () => {
            try {
                setLoading(true);
                setError(false);

                // Extrair o nome do arquivo do imagePath
                const filename = imagePath.split('/').pop();

                // Determinar se é imagem de visitante ou permissionário
                let endpoint;
                if (filename.startsWith('visitor_')) {
                    endpoint = `/images/visitors/${filename}`;
                } else if (filename.startsWith('permissionario_')) {
                    endpoint = `/images/permissionarios/${filename}`;
                } else {
                    throw new Error('Tipo de imagem não reconhecido');
                }

                // Fazer requisição com token JWT
                const response = await client.get(endpoint, {
                    responseType: 'blob',
                });

                // Criar URL do blob para exibir a imagem
                const imageBlob = new Blob([response.data], {
                    type: response.headers['content-type'] || 'image/jpeg'
                });
                const imageObjectURL = URL.createObjectURL(imageBlob);

                setImageUrl(imageObjectURL);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar imagem:', error);
                setError(true);
                setLoading(false);
            }
        };

        loadImage();

        // Cleanup: revogar URL do objeto quando o componente desmontar
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imagePath]);

    if (loading) {
        return (
            <Box
                boxSize={boxSize}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius={borderRadius}
                border="2px solid"
                borderColor="gray.200"
            >
                <Spinner size="md" />
            </Box>
        );
    }

    if (error || !imageUrl) {
        return (
            <Box
                boxSize={boxSize}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius={borderRadius}
                border="2px solid"
                borderColor="gray.200"
                bg="gray.100"
                fontSize="sm"
                color="gray.500"
                textAlign="center"
            >
                Sem imagem
            </Box>
        );
    }

    return (
        <Image
            src={imageUrl}
            alt={alt}
            boxSize={boxSize}
            objectFit={objectFit}
            borderRadius={borderRadius}
            {...props}
        />
    );
};

export default AuthenticatedImage;