import styled from "styled-components";
import { Input, Button } from "@chakra-ui/react";

export const Wrapper = styled.div`
  display: flex !important;
  flex-direction: column !important;
  width: 30% !important;
  margin: auto !important;
  margin-top: 10% !important;
  border: 1px solid #050a30 !important;
  padding: 1.5rem !important;
  border-radius: 0.8rem !important;
  background-color: #caf0f8 !important;

  @media (max-width: 700px) {
    width: 85% !important;
  }
`;

export const StyledInput = styled(Input)`
  margin-bottom: 1rem !important;
  background-color: white !important;
  border: 1px solid #050a30 !important;
`;

export const StyledButton = styled(Button)`
  width: 50% !important;
  margin-left: 25% !important;
  margin-top: 1rem !important;
  border: 1px solid #050a30 !important;
`;
