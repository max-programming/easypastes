import { Box, IconButton, Tooltip } from '@chakra-ui/react';
import { FiCopy } from 'react-icons/fi';

interface Props {
	code: string;
}

const CopyButton = ({ code }: Props) => {
	const handleClick = () => {
		// Rewrite this for cross-browser support
		navigator.clipboard.writeText(code);
	};
	return (
		<Box position="absolute" right="1" top="1" zIndex="20">
			<Tooltip hasArrow label="Copy">
				<IconButton
					aria-label="Copy Code"
					icon={<FiCopy />}
					onClick={handleClick}
					size="sm"
				/>
			</Tooltip>
		</Box>
	);
};

export default CopyButton;
