/* eslint-disable react/no-children-prop */
// Own imports
import Layout from 'components/Layout';
import DisplayCode from 'components/CodePastes/DisplayCode';
import supabaseClient from 'utils/supabase';

// Other imports
import {
  Alert,
  AlertProps,
  Container,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  useToast,
  Flex
} from '@chakra-ui/react';
import { HiOutlineKey } from 'react-icons/hi';
import { GetServerSideProps } from 'next';
import { PasteType, User } from 'types';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { FormEventHandler } from 'react';
import bcrypt from 'bcryptjs';

// Define the links
const links = [
  {
    url: '/pastes',
    text: 'Pastes'
  }
];

// Custom types
interface Props {
  paste: PasteType;
  currentUser: string | User;
}

const MotionAlert = motion<AlertProps>(Alert);

// Server side props override
export const getServerSideProps: GetServerSideProps = async context => {
  let currentUser: string | User = null;
  // @ts-ignore
  const { paste } = context.params;
  const { data: pastes, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .select('*')
    // @ts-ignore
    .eq('pasteId', paste);

  if (error || pastes.length === 0) {
    return {
      notFound: true
    };
  }

  const currentPaste = pastes[0];

  if (currentPaste.userId) {
    const { data: users } = await axios.get<Array<User>>(
      'https://api.clerk.dev/v1/users?limit=100',
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_API_KEY}`
        }
      }
    );
    currentUser = users.find(user => user.id === currentPaste.userId);
  } else {
    currentUser = 'Anonymous';
  }

  return {
    props: { paste: currentPaste, currentUser: currentUser || 'Anonymous' }
  };
};

const InfoAlert = () => (
  <MotionAlert
    variant="left-accent"
    status="error"
    initial={{ translateY: -75 }}
    animate={{ translateY: 0 }}
  >
    This is a private paste
  </MotionAlert>
);

const RenderPasteInfo = ({ paste, currentUser }: Props) => {
  return (
    <>
    {/* TODO: Rewrite all the code here, to make it better. */}
      <Heading
        textAlign="center"
        _selection={{ backgroundColor: 'purple.700' }}
        fontFamily="Poppins"
      >
        {paste.title ? paste.title : 'Untitled Paste'}
      </Heading>
      <Heading
        textAlign="center"
        size="md"
        mt="2"
        _selection={{ backgroundColor: 'purple.700' }}
        fontFamily="Poppins"
      >
        By{' '}
        {typeof currentUser !== 'string' ? (
          <Link href={`/user/pastes/${currentUser.id}`}>
            <a>{`${currentUser.first_name} ${currentUser.last_name}`}</a>
          </Link>
        ) : (
          currentUser
        )}
      </Heading>
      <Heading textAlign="center" size="sm" mt="4" fontFamily="Poppins">
        {paste.description}
      </Heading>
    </>
  );
};

const PrivatePaste = ({ paste, currentUser }: Props) => {
  const user = useUser();

  return user.id !== paste.userId ? (
    <InfoAlert />
  ) : (
    <>
      <RenderPasteInfo paste={paste} currentUser={currentUser} />
      <DisplayCode paste={paste} language={paste.language} />
    </>
  );
};

// Paste component
const Paste = ({ paste, currentUser }: Props) => {
  const [isCorrectPassword, setIsCorrectPassword] = useState<boolean>(
    !paste.pastePassword
  );

  return (
    <Layout title={paste.title || 'Paste'} links={links}>
      <Container maxW="4xl" my="6">
        {paste.private ? (
          <>
            <SignedIn>
              <PrivatePaste paste={paste} currentUser={currentUser} />
            </SignedIn>
            <SignedOut>
              <InfoAlert />
            </SignedOut>
          </>
        ) : isCorrectPassword ? (
          <>
            <RenderPasteInfo paste={paste} currentUser={currentUser} />
            <DisplayCode paste={paste} language={paste.language} />
          </>
        ) : (
          <>
            <Heading size="md" textAlign="center" mb="5" fontFamily="Poppins">
              This paste is password protected, Enter the password to view it.
            </Heading>
            <EnterPassword
              pastePwd={paste.pastePassword}
              setIsCorrectPassword={val => setIsCorrectPassword(val)}
            />
          </>
        )}
      </Container>
    </Layout>
  );
};

const EnterPassword = ({
  pastePwd,
  setIsCorrectPassword
}: {
  pastePwd: string;
  setIsCorrectPassword: (val: boolean) => void;
}) => {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const toast = useToast();
  const togglePassword = () => setShow(!show);
  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
    const matches = bcrypt.compareSync(password, pastePwd);
    if (matches) setIsCorrectPassword(true);
    else {
      toast({
        title: 'Incorrect password',
        status: 'error',
        isClosable: true,
        position: 'top-right'
      });
      setIsCorrectPassword(false);
    }
  };
  return (
    <Flex as="form" align="center" justify="center" onSubmit={handleSubmit}>
      <InputGroup size="lg">
        <InputLeftElement
          pointerEvents="none"
          children={<HiOutlineKey color="gray.300" />}
        />
        <Input
          focusBorderColor="purple.200"
          placeholder="Enter Password"
          pr="4.5rem"
          type={show ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={togglePassword}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
      <Button colorScheme="purple" type="submit" ml="3">
        Check
      </Button>
    </Flex>
  );
};

export default Paste;
