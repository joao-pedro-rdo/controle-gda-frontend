import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import ScheduleVisitorForm from "../components/ScheduleVisitorForm";
import { useAuth } from "../context/AuthContext";
import { Box } from "@chakra-ui/react";

const ScheduleVisitor = () => {
    const auth = useAuth();

    // Atualizar verificação para incluir SFPC
    if (auth.user.role !== "S2" && auth.user.role !== "SFPC") {
        return <Unauthorized />;
    }

    return (
        <Box display={"flex"} flexDirection="column">
            <Navbar />
            <ScheduleVisitorForm />
        </Box>
    );
};

export default ScheduleVisitor;