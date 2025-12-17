import { useState, useEffect } from "react";
import client from "../services/client";

export const useUnauthorizedPeople = () => {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPeople = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get("/pessoas-nao-autorizadas");
            setPeople(response.data);
        } catch (error) {
            console.error("Erro ao buscar pessoas não autorizadas:", error);
            setError("Não foi possível carregar as pessoas não autorizadas. Tente novamente mais tarde.");
            setPeople([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeople();
    }, []);

    const deletePerson = async (id) => {
        try {
            await client.delete(`/pessoas-nao-autorizadas/${id}`);
            await fetchPeople();
        } catch (error) {
            console.error("Erro ao deletar pessoa não autorizada:", error);
            setError("Não foi possível deletar a pessoa não autorizada. Tente novamente mais tarde.");
        }
    };

    const addPerson = async (person) => {
        try {
            await client.post("/pessoas-nao-autorizadas", person, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await fetchPeople();
        } catch (error) {
            console.error("Erro ao adicionar pessoa não autorizada:", error);
            setError("Não foi possível adicionar a pessoa não autorizada. Tente novamente mais tarde.");
        }
    };

    const updatePerson = async (id, person) => {
        try {
            await client.patch(`/pessoas-nao-autorizadas/${id}`, person, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await fetchPeople();
        } catch (error) {
            console.error("Erro ao atualizar pessoa não autorizada:", error);
            setError("Não foi possível atualizar a pessoa não autorizada. Tente novamente mais tarde.");
        }
    };

    return { people, loading, error, deletePerson, addPerson, updatePerson, fetchPeople };
};
