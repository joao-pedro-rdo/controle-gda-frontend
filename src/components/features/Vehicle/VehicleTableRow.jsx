import { Tr, Td, Button, Tooltip } from "@chakra-ui/react";
import QRCode from "qrcode";
import { useState } from "react";

const VehicleTableRow = ({ vehicle, onDelete }) => {
    const [qrCode, setQrCode] = useState(null);

    const generateQRCode = async (vehicle) => {
        try {
            const stringify = `{"licensePlate": "${vehicle.licensePlate}"}`;
            const response = await QRCode.toDataURL(stringify);
            setQrCode(response);
            return response;
        } catch (error) {
            console.error("Erro ao gerar QR Code:", error);
            return null;
        }
    };

    const handleDownloadQRCode = async (vehicle) => {
        let imgUrl = qrCode;

        if (!imgUrl) {
            imgUrl = await generateQRCode(vehicle);
            if (!imgUrl) return;
        }

        const link = document.createElement("a");
        link.href = imgUrl;

        const fileName = `${vehicle.completeName}_${vehicle.licensePlate.replace(
            /[^a-zA-Z0-9]/g,
            ""
        )}.png`;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Tr>
            <Td>{vehicle.completeName}</Td>
            <Td>{vehicle.tagName}</Td>
            <Td textAlign="center">{vehicle.carModel}</Td>
            <Td textAlign="center">{vehicle.licensePlate}</Td>
            <Td textAlign="center">{vehicle.color}</Td>
            <Td textAlign="center">{vehicle.driverLicense}</Td>
            <Td textAlign="center">{vehicle.idNumber}</Td>
            <Td textAlign="center">{vehicle.company}</Td>
            <Td textAlign="center">{vehicle.section}</Td>
            <Td textAlign="center">
                <Tooltip label={`Baixar QR Code de ${vehicle.completeName}`}>
                    <Button
                        size={"sm"}
                        colorScheme="green"
                        onClick={() => handleDownloadQRCode(vehicle)}
                    >
                        Download
                    </Button>
                </Tooltip>
            </Td>
            <Td textAlign="center">
                <a href={`/veiculos/${vehicle.id}`}>
                    <Button size={"sm"} colorScheme="yellow">
                        Editar
                    </Button>
                </a>
            </Td>
            <Td textAlign="center">
                <Button
                    size={"sm"}
                    colorScheme="red"
                    onClick={() => onDelete(vehicle.id)}
                >
                    Excluir
                </Button>
            </Td>
        </Tr>
    );
};

export default VehicleTableRow;
