import styled from "styled-components";
import {
  FormControl,
  Grid,
  Input,
  Select,
} from "@chakra-ui/react";

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

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
`;

export const Form = styled.form`
  width: 100%;
`;

export const StyledFormControl = styled(FormControl)`
  width: 100%;
`;

export const StyledGrid = styled(Grid)`
  width: 100%;
`;

export const StyledInput = styled(Input)`
  margin-bottom: 1rem;
`;

export const StyledSelect = styled(Select)`
  margin-bottom: 1rem;
  width: 90%;
`;

export const QRBox = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;