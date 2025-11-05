import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import client from "../services/client";
import PermissionarioForm from "../components/PermissionarioForm";
import Unauthorized from "../components/Unauthorized";

const Permissionarios = () => {
    const auth = useAuth();
    const [reload, setReload] = useState(false);
    const [toEdit, setToEdit] = useState(null);

    useEffect(() => {
        // Se houver um ID na URL, carregue o permissionário para edição
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        if (id) {
            const fetchPermissionario = async () => {
                try {
                    const response = await client.get(`/permissionarios/${id}`);
                    setToEdit(response.data);
                } catch (error) {
                    console.error("Erro ao buscar permissionário:", error);
                }
            };

            fetchPermissionario();
        }
    }, []);

    // Apenas usuários com perfil S2 podem acessar esta página
    if (auth.user.role !== "S2") return <Unauthorized />;

    return (
        <Box display={"flex"} flexDirection="column">
            <Navbar />
            <PermissionarioForm
                toEdit={toEdit}
                setToEdit={setToEdit}
                reload={reload}
                setReload={setReload}
            />
        </Box>
    );
};

export default Permissionarios;