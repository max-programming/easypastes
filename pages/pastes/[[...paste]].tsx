/* eslint-disable react/no-children-prop */
// Own imports
import Layout from 'components/Layout';
import DisplayCode from 'components/CodePastes/DisplayCode';
import supabaseClient from 'utils/supabase';

// Other imports
import {
  Alert,
  AlertProps,
  Avatar,
  Container,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  useToast,
  Flex,
  Tag,
  TagLeftIcon,
  TagLabel,
  Center
} from '@chakra-ui/react';
import { HiOutlineKey, HiOutlineUser, HiOutlineCode } from 'react-icons/hi';
import { GetServerSideProps } from 'next';
import { PasteType, User } from 'types';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';
import { useState, FormEventHandler } from 'react';
import { NextSeo } from 'next-seo';
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
  currentUser: 'Anonymous' | User;
}

const MotionAlert = motion<AlertProps>(Alert);

// Server side props override
export const getServerSideProps: GetServerSideProps = async context => {
  // @ts-ignore
  const paste = context.params.paste.join('/');
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

  if (!currentPaste.userId) {
    return {
      props: { paste: currentPaste, currentUser: 'Anonymous' }
    };
  }

  const { data: user, status } = await axios.get<User>(
    `https://api.clerk.dev/v1/users/${currentPaste.userId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_API_KEY}`
      }
    }
  );

  return {
    props: { paste: currentPaste, currentUser: user || 'Anonymous' }
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
      <Heading
        textAlign="center"
        _selection={{ backgroundColor: 'purple.700' }}
        fontFamily="Poppins"
      >
        {paste.title ? paste.title : 'Untitled Paste'}
      </Heading>
      <Center mt="3">
        {typeof currentUser !== 'string' ? (
          <>
            <Link href={`/user/pastes/${currentUser.id}`}>
              <a>
                <Tag size="lg" variant="subtle" colorScheme="purple">
                  {currentUser.profile_image_url ? (
                    <Avatar
                      src={currentUser.profile_image_url}
                      size="xs"
                      name={`${currentUser.first_name} ${currentUser.last_name}`}
                      ml={-1}
                      mr={2}
                    />
                  ) : (
                    <TagLeftIcon boxSize="16px" as={HiOutlineUser} />
                  )}

                  <TagLabel>
                    {`${currentUser.first_name} ${currentUser.last_name}`}
                  </TagLabel>
                </Tag>
              </a>
            </Link>
          </>
        ) : (
          <>
            <Tag size="lg" variant="subtle" colorScheme="gray">
              <TagLeftIcon boxSize="16px" as={HiOutlineUser} />
              <TagLabel>{currentUser}</TagLabel>
            </Tag>
          </>
        )}

        <Tag size="lg" variant="subtle" colorScheme="cyan" ml="2">
          <TagLeftIcon boxSize="16px" as={HiOutlineCode} />
          <TagLabel>{paste.language}</TagLabel>
        </Tag>
      </Center>

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

// Paste component
const Paste = ({ paste, currentUser }: Props) => {
  const [isCorrectPassword, setIsCorrectPassword] = useState<boolean>(
    !paste.pastePassword
  );

  return (
    <Layout title={paste.title || 'Paste'} links={links}>
      <NextSeo
        title={paste.title || 'Untitled Paste'}
        description={paste.description || ''}
      />
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

export default Paste;
