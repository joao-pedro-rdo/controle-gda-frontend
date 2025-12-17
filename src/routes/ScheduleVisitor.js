
import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import ScheduleVisitorForm from "../components/features/Visitor/ScheduleVisitorForm";
import { useAuth } from "../context/AuthContext";
import { Box } from "@chakra-ui/react";

const ScheduleVisitor = () => {
    const auth = useAuth();

    if (auth.user.role !== "S2" && auth.user.role !== "SFPC") {
        return <Unauthorized />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-white shadow print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        🗓️ Agendamento de Visitantes
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Preencha os dados abaixo para agendar a entrada de um visitante.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <ScheduleVisitorForm />
            </div>
        </div>
    );
};

export default ScheduleVisitor;
