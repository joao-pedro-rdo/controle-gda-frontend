import { Table, Thead, Tr, Th, Tbody } from "@chakra-ui/react";
import VehicleTableRow from "./VehicleTableRow";

const VehiclesTable = ({ vehicles, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <Table variant="striped" colorScheme="red" size="sm">
                <Thead>
                    <Tr>
                        <Th textAlign="center">Nome</Th>
                        <Th textAlign="center">P/G Nome Guerra</Th>
                        <Th textAlign="center">Carro</Th>
                        <Th textAlign="center">Placa</Th>
                        <Th textAlign="center">Cor</Th>
                        <Th textAlign="center">Habilitação</Th>
                        <Th textAlign="center">Idt</Th>
                        <Th textAlign="center">Esqd</Th>
                        <Th textAlign="center">Seção</Th>
                        <Th textAlign="center">QR Code</Th>
                        <Th textAlign="center">Editar</Th>
                        <Th textAlign="center">Excluir</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {vehicles.map((vehicle) => (
                        <VehicleTableRow
                            key={vehicle.id}
                            vehicle={vehicle}
                            onDelete={onDelete}
                        />
                    ))}
                </Tbody>
            </Table>
        </div>
    );
};

export default VehiclesTable;
