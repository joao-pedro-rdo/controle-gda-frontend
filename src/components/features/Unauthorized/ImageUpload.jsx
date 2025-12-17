import { useState, useRef, useEffect } from "react";
import { Box, Button, Image, IconButton, HStack } from "@chakra-ui/react";
import { MdClose, MdImage } from "react-icons/md";
import { PhotoCapture } from "./PhotoCapture";

const ImageUpload = ({ onFileSelect, onImageCapture, currentImage }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const [imageBase64, setImageBase64] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (currentImage) {
            setPreviewImage(`/api/images/pessoas-nao-autorizadas/${currentImage.split("/").pop()}`);
        }
    }, [currentImage]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Por favor, selecione apenas arquivos de imagem");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("A imagem deve ter no máximo 5MB");
                return;
            }

            onFileSelect(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
            setImageBase64("");
            onImageCapture("");
        }
    };

    const handleImageCapture = (imageData) => {
        setImageBase64(imageData);
        setPreviewImage(imageData);
        onImageCapture(imageData);
        onFileSelect(null);
    };

    const removeImage = () => {
        setPreviewImage(null);
        setImageBase64("");
        onFileSelect(null);
        onImageCapture("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
            />

            {previewImage && (
                <Box position="relative" display="inline-block" mb={4}>
                    <Image
                        src={previewImage}
                        alt="Preview"
                        maxWidth="200px"
                        maxHeight="200px"
                        objectFit="cover"
                        border="2px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                    />
                    <IconButton
                        icon={<MdClose />}
                        size="sm"
                        colorScheme="red"
                        position="absolute"
                        top={-2}
                        right={-2}
                        onClick={removeImage}
                    />
                </Box>
            )}

            {!previewImage && (
                <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300 mb-4">
                    <p className="text-sm text-gray-500">Sem imagem</p>
                </div>
            )}

            <HStack spacing={2} mt={2}>
                <Button
                    leftIcon={<MdImage />}
                    onClick={openFileSelector}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                >
                    Selecionar Arquivo
                </Button>
                <PhotoCapture onImageCapture={handleImageCapture} showImportFromSystem={false} />
            </HStack>
        </div>
    );
};

export default ImageUpload;
