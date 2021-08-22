// Packages
import { Dispatch, SetStateAction } from 'react';

// Components
import { Box, Input } from '@chakra-ui/react';

interface Props {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
}

const CustomURL = ({ url, setUrl }: Props) => {
  return (
    <Box>
      <Input
        placeholder="Custom URL"
        focusBorderColor="purple.200"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
    </Box>
  );
};

export default CustomURL;
