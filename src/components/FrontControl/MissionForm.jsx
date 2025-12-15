import { Box, Button, Flex, FormLabel, Input, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import client from '../../services/client';

const MissionForm = ({ mission, setMission }) => {
  const { register, handleSubmit, reset } = useForm();

  const submitMission = async (data) => {
    try {
      if (!mission?.initialOdometer) {
        const { initialOdometer, chefeVtr } = data;
        await client.patch(`/initialOdometer/${mission.id}`, {
          initialOdometer,
          chefeVtr,
        });
      } else {
        const { finalOdometer } = data;
        await client.patch(`/finalOdometer/${mission.id}`, {
          finalOdometer,
        });
      }
      reset();
      setMission(null);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (mission?.initialOdometer && mission?.finalOdometer) {
    return (
      <Text fontWeight={700} mt={12} fontSize={35} color="red">
        FICHA INVÁLIDA!
      </Text>
    );
  }

  return (
    <Box w="60%" border="1px solid #ccc" borderRadius="1rem" p={5} mt={5}>
      <form onSubmit={handleSubmit(submitMission)}>
        <Flex flexDir="column" gap={5}>
          <Text fontSize="1.5rem">
            <strong>Motorista: </strong>
            {mission.driver.name}
          </Text>
          <Text fontSize="1.5rem">
            <strong>Missão: </strong>
            {mission.complements}
          </Text>
        </Flex>

        <Flex justifyContent="space-between" w="100%">
          {!mission?.initialOdometer && (
            <Flex w="100%">
              <FormLabel w="100%" mt={6} fontSize="1.1rem">
                <strong>Chefe de viatura: </strong>
                <Input w="70%" type="text" {...register('chefeVtr')} />
              </FormLabel>
            </Flex>
          )}

          <Text mt={6} fontSize="1.1rem">
            <strong>Hodômetro:</strong>
            <Input
              w="50%"
              type="number"
              {...register(mission?.initialOdometer ? 'finalOdometer' : 'initialOdometer')}
            />
          </Text>
        </Flex>
        <Button
          w="100%"
          mt={5}
          type="submit"
          colorScheme={mission?.initialOdometer ? 'red' : 'green'}
        >
          {mission?.initialOdometer ? 'Fechar ficha' : 'Abrir ficha'}
        </Button>
      </form>
    </Box>
  );
};

export default MissionForm;
