import { Box, Heading, Text } from '@chakra-ui/react';
import { PasteType } from 'types';
import DisplayCode from './DisplayCode';
import Link from 'next/link';

const Paste = ({ paste }: { paste: PasteType }) => {
  return (
    <Box mt="6">
      <Heading size="md">
        <Link href={`/pastes/${paste.pasteId}`} passHref>
          <Text as="a" _selection={{ backgroundColor: 'purple.700' }}>
            {paste.title || 'Untitled'}
          </Text>
        </Link>
      </Heading>
      <DisplayCode paste={paste} language={paste.language} />
    </Box>
  );
};

export default Paste;
