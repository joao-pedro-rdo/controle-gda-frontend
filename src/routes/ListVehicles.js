import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import { useVehicles } from "../hooks/useVehicles";
import VehiclesTable from "../components/features/Vehicle/VehiclesTable";
import { Box, Text } from "@chakra-ui/react";

const ListVehicles = () => {
    const auth = useAuth();
    const { vehicles, loading, error, deleteVehicle } = useVehicles();

    if (auth.user.role !== "S2") {
        return <Unauthorized />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-white shadow print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Lista de Veículos Autorizados
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Consulte, edite ou remova os veículos cadastrados.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {loading && <p>Carregando veículos...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && (
                    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                        <VehiclesTable vehicles={vehicles} onDelete={deleteVehicle} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListVehicles;