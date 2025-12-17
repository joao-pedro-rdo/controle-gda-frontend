import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import { useAuth } from "../context/AuthContext";
import { useScheduledVisitors } from "../hooks/useScheduledVisitors";
import ScheduledVisitorCard from "../components/ScheduledVisitors/ScheduledVisitorCard";

const ScheduledVisitors = () => {
    const auth = useAuth();
    const { scheduledVisitors, loading, error } = useScheduledVisitors();

    if (auth.user.role !== "Guarda" && auth.user.role !== "SFPC" && auth.user.role !== "S2") {
        return <Unauthorized />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-white shadow print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        ☕ Agendamentos do Dia
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Visitantes com entrada agendada para hoje, {new Date().toLocaleDateString('pt-BR')}.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                        <p className="mt-4 text-gray-600">Carregando agendamentos...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">❌ Erro ao carregar dados: {error}</p>
                    </div>
                )}

                {!loading && !error && scheduledVisitors.length === 0 && (
                    <div className="text-center py-12">
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
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum agendamento para hoje</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Não há visitantes agendados para a data de hoje.
                        </p>
                    </div>
                )}

                {!loading && !error && scheduledVisitors.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scheduledVisitors.map((visitor) => (
                            <ScheduledVisitorCard key={visitor.id} visitor={visitor} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduledVisitors;
