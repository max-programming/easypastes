// Packages
import Link from 'next/link';

// Components
import { Box, Heading, Text } from '@chakra-ui/react';
import DisplayCode from './DisplayCode';

// Types
import { PasteType } from 'types';

interface Props {
  paste: PasteType;
  isPassword?: boolean;
}

const Paste = ({ paste, isPassword }: Props) => {
  console.log({ isPassword });
  return (
    <Box mt="6">
      <Heading size="md" fontFamily="Poppins">
        <Link href={`/pastes/${paste.pasteId}`} passHref>
          <Text as="a" _selection={{ backgroundColor: 'purple.700' }}>
            {paste.title || 'Untitled'}
          </Text>
        </Link>
      </Heading>
      <Box hidden={isPassword}>
        <DisplayCode paste={paste} language={paste.language} />
      </Box>
    </Box>
  );
};

export default Paste;
