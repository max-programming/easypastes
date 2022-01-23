import { Box, Text, useDisclosure } from '@chakra-ui/react';
import { PasteType } from 'types';
import PasteModel from './PasteModal';

interface Props {
  paste: PasteType;
  isPassword?: boolean;
}

const Paste = ({ paste, isPassword }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box mt="6">
      <Text
        as="a"
        cursor="pointer"
        onClick={onOpen}
        _selection={{ backgroundColor: 'purple.700' }}
      >
        {paste.title || 'Untitled'}
      </Text>
      <PasteModel pasteId={paste.pasteId} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default Paste;
