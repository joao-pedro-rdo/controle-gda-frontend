import { Box, Text } from "@chakra-ui/react";
import Navbar from "../Navbar";

const Unauthorized = () => {
  return (
    <>
      <Navbar />
      <Box
        display={"flex"}
        justifyContent="center"
        bgColor={"red"}
        w="50%"
        margin="auto"
        mt="1rem"
        p={5}
        borderRadius={15}
      >
        <Text color={"white"} fontWeight="700" fontSize={"1.8rem"}>
          Você não possui autorização para estar nessa página!
        </Text>
      </Box>
    </>
  );
};

export default Unauthorized;
