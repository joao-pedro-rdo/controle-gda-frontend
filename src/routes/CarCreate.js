import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import VehicleForm from "../components/features/Vehicle/VehicleForm";
import { useAuth } from "../context/AuthContext";

const CarCreate = () => {
    const auth = useAuth();

    if (auth.user.role !== "S2") {
        return <Unauthorized />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-white shadow print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        🚗 Cadastro de Veículos
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Preencha os dados para cadastrar um novo veículo de militar.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <VehicleForm />
            </div>
        </div>
    );
};

export default CarCreate;