import {
  RadioGroup,
  Radio,
  Stack,
  Box,
  Select,
  useMediaQuery
} from '@chakra-ui/react';
import { SignedIn } from '@clerk/clerk-react';
import type { ChangeEventHandler, Dispatch, SetStateAction } from 'react';

interface Props {
  visibility: string;
  setVisibility: Dispatch<SetStateAction<string>>;
}

const Visibility = ({ visibility, setVisibility }: Props) => {
  const [matches] = useMediaQuery('(max-width: 768px)');
  const handleChange: ChangeEventHandler<HTMLSelectElement> = e => {
    setVisibility(e.target.value);
  };
  return !matches ? (
    <RadioGroup
      onChange={setVisibility}
      value={visibility}
      colorScheme="purple"
    >
      <Stack direction="row">
        <Radio value="public">Public</Radio>
        <Radio value="unlisted">Unlisted</Radio>
        <SignedIn>
          <Radio value="private">Private</Radio>
        </SignedIn>
      </Stack>
    </RadioGroup>
  ) : (
    <VisibilityMobile visibility={visibility} handleChange={handleChange} />
  );
};

const VisibilityMobile = ({
  visibility,
  handleChange
}: {
  visibility: string;
  handleChange: ChangeEventHandler<HTMLSelectElement>;
}) => {
  return (
    <Box flex="2">
      <Select
        value={visibility}
        id="select-visibility"
        onChange={handleChange}
        fontSize="sm"
        focusBorderColor="purple.200"
      >
        <option value="Public">Public</option>
        <option value="Unlisted">Unlisted</option>
        <SignedIn>
          <option value="Private">Private</option>
        </SignedIn>
      </Select>
    </Box>
  );
};

export default Visibility;
