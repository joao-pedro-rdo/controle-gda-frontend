import styled from "styled-components";
import { FormControl, Input, Box, Grid } from "@chakra-ui/react";

export const Wrapper = styled.div`
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  width: 90%;
  margin: auto;
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 1rem;
  background-color: white;
`;

export const StyledGrid = styled(Grid)`
  @media (max-width: 700px) {
    display: flex !important;
    flex-direction: column !important;
  }
`;

export const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledFormControl = styled(FormControl)`
  width: 90%;
`;

export const StyledInput = styled(Input)`
  width: 90%;
  margin-bottom: 1rem;
`;

export const QRBox = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
