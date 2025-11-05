import styled from "styled-components";
import { FormControl, Input, Box, Grid, Flex } from "@chakra-ui/react";
import InputMask from "react-input-mask";

export const Wrapper = styled.div`
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  width: 90%;
  margin: auto;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 1rem;
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

export const StyledInputMask = styled(InputMask)`
  width: 90%;
  margin-bottom: 1rem;
  padding: 0 16px 0 16px;
  border: 1px solid #e2e8f0;
  width: 100%;
  height: 38px;
  border-radius: 0.375rem;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ImageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  @media (max-width: 700px) {
    margin-bottom: 1rem;
  }
`;

export const ButtonContainer = styled(Flex)`
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  @media (max-width: 700px) {
    flex-wrap: wrap;
  }
`;
