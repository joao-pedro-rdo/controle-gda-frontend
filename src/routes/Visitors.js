import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import VisitorForm from "../components/features/Visitor/VisitorForm";
import UnauthorizedPanel from "../components/features/Visitor/UnauthorizedPanel";
import { useAuth } from "../context/AuthContext";

const Visitors = () => {
    const auth = useAuth();

    if (auth.user.role !== "Guarda") {
        return <Unauthorized />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-white shadow print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        🛂 Registro de Visitantes
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Preencha os dados para registrar a entrada de um visitante.
                    </p>
                </div>
            </div>

            <div className="flex">
                <UnauthorizedPanel />
                <div className="flex-1 ml-80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <VisitorForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Visitors;
