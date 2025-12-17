import { Tr, Td, Button, Tooltip } from "@chakra-ui/react";
import QRCode from "qrcode";
import { useState } from "react";

const VehicleTableRow = ({ vehicle, onDelete, mobile }) => {
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

    if (mobile) {
        return (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden p-4 space-y-2">
                <p className="text-sm"><strong>Nome:</strong> {vehicle.completeName}</p>
                <p className="text-sm"><strong>P/G Nome Guerra:</strong> {vehicle.tagName}</p>
                <p className="text-sm"><strong>Carro:</strong> {vehicle.carModel}</p>
                <p className="text-sm"><strong>Placa:</strong> {vehicle.licensePlate}</p>
                <p className="text-sm"><strong>Cor:</strong> {vehicle.color}</p>
                <p className="text-sm"><strong>Habilitação:</strong> {vehicle.driverLicense}</p>
                <p className="text-sm"><strong>Idt:</strong> {vehicle.idNumber}</p>
                <p className="text-sm"><strong>Esqd:</strong> {vehicle.company}</p>
                <p className="text-sm"><strong>Seção:</strong> {vehicle.section}</p>
                <div className="flex justify-end space-x-2 pt-2 border-t">
                    <Tooltip label="Baixar QR Code">
                        <Button size="sm" colorScheme="green" onClick={() => handleDownloadQRCode(vehicle)}>
                            QR Code
                        </Button>
                    </Tooltip>
                    <a href={`/veiculos/${vehicle.id}`}>
                        <Button size="sm" colorScheme="yellow">
                            Editar
                        </Button>
                    </a>
                    <Button size="sm" colorScheme="red" onClick={() => onDelete(vehicle.id)}>
                        Excluir
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Tr>
            <Td>{vehicle.completeName}</Td>
            <Td>{vehicle.tagName}</Td>
            <Td>{vehicle.carModel}</Td>
            <Td>{vehicle.licensePlate}</Td>
            <Td>{vehicle.color}</Td>
            <Td>{vehicle.driverLicense}</Td>
            <Td>{vehicle.idNumber}</Td>
            <Td>{vehicle.company}</Td>
            <Td>{vehicle.section}</Td>
            <Td>
                <div className="flex space-x-2">
                    <Tooltip label="Baixar QR Code">
                        <Button size="sm" colorScheme="green" onClick={() => handleDownloadQRCode(vehicle)}>
                            Download
                        </Button>
                    </Tooltip>
                    <a href={`/veiculos/${vehicle.id}`}>
                        <Button size="sm" colorScheme="yellow">
                            Editar
                        </Button>
                    </a>
                    <Button size="sm" colorScheme="red" onClick={() => onDelete(vehicle.id)}>
                        Excluir
                    </Button>
                </div>
            </Td>
        </Tr>
    );
};

export default VehicleTableRow;