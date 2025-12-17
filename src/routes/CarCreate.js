import Navbar from "../components/Navbar";
import Unauthorized from "../components/Unauthorized";
import VehicleForm from "../components/VehicleForm";
import { useAuth } from "../context/AuthContext";

const CarCreate = () => {
  const auth = useAuth();

  if (auth.user.role !== "S2") return <Unauthorized />;

  return (
    <>
      <Navbar />
      <section className="mx-auto flex w-[90%] items-center justify-center">
        <VehicleForm />
      </section>
    </>
  );
};

export default CarCreate;
