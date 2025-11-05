import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import VisitorForm from "../components/VisitorForm";
import { useAuth } from "../context/AuthContext";

const Visitors = () => {
  const auth = useAuth();

  if (auth.user.role !== "Guarda") return <Unauthorized />;

  return (
    <>
      <Navbar />
      <VisitorForm />
    </>
  );
};

export default Visitors;
