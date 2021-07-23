import { Box, Heading } from '@chakra-ui/react';
import { PasteType } from 'types';
import DisplayCode from './DisplayCode';
import Link from 'next/link';

const Paste = ({ paste }: { paste: PasteType }) => {
	return (
		<Box mt="6">
			<Heading size="md">
				<Link href={`/pastes/${paste.pasteId}`}>
					<a>{paste.title || 'Untitled'}</a>
				</Link>
			</Heading>
			<DisplayCode code={paste.code} language={paste.language} />
		</Box>
	);
};

export default Paste;
