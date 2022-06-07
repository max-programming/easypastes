import { Flex, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import { SignedIn } from '@clerk/nextjs';

import Visibility from 'components/Others/Visibility';

import { SetState } from 'types';

interface Props {
  matches: boolean;
  isUrlTaken: boolean;
  url: string;
  visibility: string;
  setVisibility: SetState<string>;
  setUrl: SetState<string>;
}

export default function PasteSettings({
  matches,
  isUrlTaken,
  url,
  visibility,
  setVisibility,
  setUrl
}: Props) {
  return (
    <Flex
      align="center"
      justify="center"
      mt="4"
      flexDir={matches ? 'column' : 'row'}
    >
      <SignedIn>
        <InputGroup size="md" flex="2">
          <InputLeftAddon>easypastes.tk/pastes/</InputLeftAddon>
          <Input
            placeholder="Custom URL (optional)"
            focusBorderColor="purple.200"
            value={url}
            onChange={e => setUrl(e.target.value)}
            isInvalid={isUrlTaken}
          />
        </InputGroup>
      </SignedIn>
      <Flex
        justify="center"
        align="center"
        my="3"
        flex="1"
        w={matches ? 'full' : 'initial'}
      >
        <label style={{ marginRight: 8 }}>Visibility: </label>
        <Visibility visibility={visibility} setVisibility={setVisibility} />
      </Flex>
    </Flex>
  );
}
