import styled from "styled-components";
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
      <Wrapper>
        <VehicleForm />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: auto;
  width: 90%;
  background-color: rgb(255, 255, 255, 0.8);
  height: 90vh;
  margin-top: 10px;
  border-radius: 20px;
`;

export default CarCreate;
