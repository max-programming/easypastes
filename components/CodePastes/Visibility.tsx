import { RadioGroup, Radio, Stack } from "@chakra-ui/react";
import { SignedIn } from "@clerk/clerk-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  visibility: string;
  setVisibility: Dispatch<SetStateAction<string>>;
}

const Visibility = ({ visibility, setVisibility }: Props) => {
  return (
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
  );
};

export default Visibility;
