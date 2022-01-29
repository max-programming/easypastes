import {
  Box,
  Text,
  Tag,
  TagLabel,
  TagLeftIcon,
  useDisclosure,
  Flex
} from '@chakra-ui/react';
import { HiOutlineCode } from 'react-icons/hi';
import { PasteType } from 'types';
import PasteModal from './PasteModal';

interface Props {
  paste: PasteType;
  isPassword?: boolean;
}

const Paste = ({ paste, isPassword }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box mt="6">
      <Flex justify="space-between">
        <Text
          as="a"
          cursor="pointer"
          onClick={onOpen}
          _selection={{ backgroundColor: 'purple.700' }}
        >
          {paste.title || 'Untitled'}
        </Text>
        <Tag size="md" variant="subtle" colorScheme="cyan" ml="2">
          <TagLeftIcon boxSize="16px" as={HiOutlineCode} />
          <TagLabel>{paste.language}</TagLabel>
        </Tag>
      </Flex>
      <PasteModal pasteId={paste.pasteId} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default Paste;
