import { Center, Heading } from '@chakra-ui/react';
import { FcReadingEbook } from 'react-icons/fc';

export default function NoPastes() {
  return (
    <Center h="xl" flexDir="column">
      <FcReadingEbook size="8rem" />
      <Heading fontFamily="Poppins">No pastes here</Heading>
    </Center>
  );
}
