import { useState, useEffect } from "react";
import client from "../services/client";

export const useVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get("/vehicles");
            const sortedVehicles = response.data.sort((a, b) =>
                a.completeName.localeCompare(b.completeName)
            );
            setVehicles(sortedVehicles);
        } catch (error) {
            console.error("Erro ao buscar veículos:", error);
            setError("Não foi possível carregar os veículos. Tente novamente mais tarde.");
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const deleteVehicle = async (id) => {
        try {
            await client.delete(`/vehicles/${id}`);
            await fetchVehicles();
        } catch (error) {
            console.error("Erro ao deletar veículo:", error);
            setError("Não foi possível deletar o veículo. Tente novamente mais tarde.");
        }
    };

    return { vehicles, loading, error, deleteVehicle };
};
