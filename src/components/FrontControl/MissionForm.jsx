import { Button, FormLabel, Input } from '@chakra-ui/react';
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
      <p className="font-bold mt-12 text-3xl md:text-4xl text-red-600 text-center">
        FICHA INVÁLIDA!
      </p>
    );
  }

  return (
    <div className="w-full max-w-xl border border-gray-300 rounded-2xl p-4 md:p-6 mt-5 bg-white shadow-sm">
      <form onSubmit={handleSubmit(submitMission)}>
        <div className="flex flex-col gap-4 md:gap-5">
          <p className="text-lg md:text-xl">
            <strong>Motorista: </strong>
            {mission.driver.name}
          </p>
          <p className="text-lg md:text-xl">
            <strong>Missão: </strong>
            {mission.complements}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between w-full gap-4 mt-6">
          {!mission?.initialOdometer && (
            <div className="w-full">
              <FormLabel className="text-base md:text-lg font-semibold">
                Chefe de viatura:
              </FormLabel>
              <Input
                type="text"
                {...register('chefeVtr')}
                size={{ base: 'md', md: 'lg' }}
                className="w-full"
              />
            </div>
          )}

          <div className="w-full">
            <FormLabel className="text-base md:text-lg font-semibold">
              Hodômetro:
            </FormLabel>
            <Input
              type="number"
              {...register(
                mission?.initialOdometer ? 'finalOdometer' : 'initialOdometer'
              )}
              size={{ base: 'md', md: 'lg' }}
              className="w-full"
            />
          </div>
        </div>

        <Button
          w="100%"
          mt={5}
          type="submit"
          size={{ base: 'md', md: 'lg' }}
          colorScheme={mission?.initialOdometer ? 'red' : 'green'}
          className="font-semibold"
        >
          {mission?.initialOdometer ? 'Fechar ficha' : 'Abrir ficha'}
        </Button>
      </form>
    </div>
  );
};

export default MissionForm;
