import { useState, useEffect } from "react";
import client from "../services/client";
import { useAuth } from "../context/AuthContext";
import { localDayRange } from "../utils/dates";

// Agendamentos pendentes do dia de hoje no fuso local (tela da Guarda).
export const useScheduledVisitors = () => {
    const auth = useAuth();
    const [scheduledVisitors, setScheduledVisitors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (auth.user.role === "Guarda" || auth.user.role === "SFPC" || auth.user.role === "S2") {
            const fetchScheduledVisitors = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const response = await client.get("/entries/scheduled", { params: localDayRange() });
                    setScheduledVisitors(response.data || []);
                } catch (error) {
                    console.error("Erro ao buscar agendamentos:", error);
                    setError("Não foi possível carregar os agendamentos. Tente novamente mais tarde.");
                    setScheduledVisitors([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchScheduledVisitors();
        }
    }, [auth.user.role]);

    return { scheduledVisitors, loading, error };
};
