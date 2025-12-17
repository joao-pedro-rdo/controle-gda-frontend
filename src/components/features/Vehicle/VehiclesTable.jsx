import { Table, Thead, Tr, Th, Tbody } from "@chakra-ui/react";
import VehicleTableRow from "./VehicleTableRow";

const VehiclesTable = ({ vehicles, onDelete }) => {
    if (!vehicles || vehicles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font--medium text-gray-900">Nenhum veículo encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Não há veículos cadastrados no momento.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Tabela - Desktop */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
                <Table variant="striped" colorScheme="red" size="sm">
                    <Thead>
                        <Tr>
                            <Th>Nome</Th>
                            <Th>P/G Nome Guerra</Th>
                            <Th>Carro</Th>
                            <Th>Placa</Th>
                            <Th>Cor</Th>
                            <Th>Habilitação</Th>
                            <Th>Idt</Th>
                            <Th>Esqd</Th>
                            <Th>Seção</Th>
                            <Th>Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {vehicles.map((vehicle) => (
                            <VehicleTableRow key={vehicle.id} vehicle={vehicle} onDelete={onDelete} />
                        ))}
                    </Tbody>
                </Table>
            </div>

            {/* Cards - Mobile */}
            <div className="md:hidden space-y-4">
                {vehicles.map((vehicle) => (
                    <VehicleTableRow key={vehicle.id} vehicle={vehicle} onDelete={onDelete} mobile />
                ))}
            </div>
        </div>
    );
};

export default VehiclesTable;
