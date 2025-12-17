import { Badge, Button, Box, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ScheduledVisitorCard = ({ visitor }) => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleConfirmScheduled = (scheduledVisitor) => {
        navigate("/visitante", {
            state: { scheduledVisitor }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transform transition-transform hover:scale-105">
            <div className="p-4 bg-blue-500">
                <h3 className="text-xl font-bold text-white truncate">{visitor.name}</h3>
                <Badge colorScheme="blue" variant="solid" fontSize="0.8em">
                    AGENDADO
                </Badge>
            </div>
            <div className="p-4 space-y-2">
                <p className="text-sm text-gray-600"><strong>CPF:</strong> {visitor.idNumber}</p>
                <p className="text-sm text-gray-600"><strong>Telefone:</strong> {visitor.phoneNumber || "N/A"}</p>
                <p className="text-sm text-gray-600"><strong>Veículo:</strong> {`${visitor.carModel} - ${visitor.color}`}</p>
                <p className="text-sm text-gray-600"><strong>Placa:</strong> {visitor.licensePlate}</p>
                <p className="text-sm text-gray-600"><strong>Destino:</strong> {visitor.target}</p>
                <p className="text-sm text-gray-600"><strong>Contato:</strong> {visitor.contactPerson}</p>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
                <p className="text-sm font-medium text-gray-800">Horário Agendado</p>
                <p className="text-2xl font-bold text-blue-600">{format(new Date(visitor.scheduledDate), "HH:mm", { locale: ptBR })}</p>
                <p className="text-xs text-gray-500">{format(new Date(visitor.scheduledDate), "dd/MM/yyyy", { locale: ptBR })}</p>
            </div>
            <div className="p-4">
                {auth.user.role === "Guarda" && (
                    <Button
                        colorScheme="green"
                        width="100%"
                        onClick={() => handleConfirmScheduled(visitor)}
                    >
                        Registrar Entrada
                    </Button>
                )}
                {(auth.user.role === "SFPC" || auth.user.role === "S2") && (
                     <div className="p-3 bg-gray-100 rounded-md text-center">
                        <p className="text-sm text-gray-600 font-style: italic">Apenas visualização</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduledVisitorCard;
