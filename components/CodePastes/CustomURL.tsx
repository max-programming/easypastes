import { Box, Input } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

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
