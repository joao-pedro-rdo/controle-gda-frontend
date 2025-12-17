import { useState, useEffect } from "react";
import QRCode from "qrcode";
import client from "../../../services/client";
import { Button, Image, Box, Tooltip } from "@chakra-ui/react";

const QRCodeSection = ({ vehicleId }) => {
    const [imgUrl, setImgUrl] = useState();
    const [vehicle, setVehicle] = useState({});

    useEffect(() => {
        if (vehicleId) {
            const fetchVehicle = async () => {
                try {
                    const response = await client.get(`/vehicles/${vehicleId}`);
                    setVehicle(response.data);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchVehicle();
        }
    }, [vehicleId]);

    useEffect(() => {
        if (vehicle.licensePlate) {
            const generateQRCode = async () => {
                try {
                    const stringify = `{"licensePlate": "${vehicle.licensePlate}"}`;
                    const response = await QRCode.toDataURL(stringify);
                    setImgUrl(response);
                } catch (error) {
                    console.log(error);
                }
            };
            generateQRCode();
        }
    }, [vehicle]);

    const handleDownloadQRCode = () => {
        if (!imgUrl || !vehicle.completeName || !vehicle.licensePlate) return;

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

    if (!vehicleId) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 border-t mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">QR Code do Veículo</h2>
            <div className="w-64 h-64 flex items-center justify-center">
                <Image src={imgUrl} alt="QR Code" />
            </div>
            {imgUrl && (
                <Tooltip label={`Baixar QR Code de ${vehicle.completeName || "Veículo"}`}>
                    <Button onClick={handleDownloadQRCode} colorScheme="green" mt="4">
                        Download QR Code
                    </Button>
                </Tooltip>
            )}
        </div>
    );
};

export default QRCodeSection;
