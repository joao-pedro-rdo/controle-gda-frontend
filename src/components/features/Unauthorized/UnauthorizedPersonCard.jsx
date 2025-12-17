import {
    Box,
    Badge,
    Text,
    VStack,
    HStack,
    Image,
    IconButton,
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";

const UnauthorizedPersonCard = ({ person, onEdit, onDelete, canEdit }) => {
    const formatCPF = (cpf) => {
        if (!cpf) return "";
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-red-200 overflow-hidden">
            <div className="p-4 flex space-x-4">
                <div className="flex-shrink-0">
                    {person.imagePath ? (
                        <Image
                            src={`/api/images/pessoas-nao-autorizadas/${person.imagePath.split("/").pop()}`}
                            alt={person.nome}
                            width="80px"
                            height="80px"
                            objectFit="cover"
                            borderRadius="md"
                            border="2px solid"
                            borderColor="red.200"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center border-2 border-gray-200">
                            <p className="text-xs text-gray-500">Sem foto</p>
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center">
                        <h3 className="text-lg font-bold">{person.nome}</h3>
                        <Badge ml="2" colorScheme="red" variant="solid">
                            NÃO AUTORIZADA
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                        <strong>CPF:</strong> {formatCPF(person.CPF)}
                    </p>
                    {person.identidade && (
                        <p className="text-sm text-gray-600">
                            <strong>Identidade:</strong> {person.identidade}
                        </p>
                    )}
                    {person.observacao && (
                        <p className="text-sm text-gray-700 mt-2">
                            <strong>Observação:</strong> {person.observacao}
                        </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                        Cadastrado em: {new Date(person.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                </div>

                {canEdit && (
                    <div className="flex flex-col space-y-2">
                        <IconButton
                            icon={<MdEdit />}
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(person)}
                            aria-label="Editar pessoa"
                        />
                        <IconButton
                            icon={<MdDelete />}
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(person)}
                            aria-label="Excluir pessoa"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnauthorizedPersonCard;
