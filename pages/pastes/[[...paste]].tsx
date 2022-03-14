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
  Flex,
  Tag,
  TagLeftIcon,
  TagLabel,
  Center,
  Tooltip
} from '@chakra-ui/react';
import { HiOutlineKey, HiOutlineUser, HiOutlineCode } from 'react-icons/hi';
import { GetServerSideProps } from 'next';
import { PasteType, User } from 'types';
import { SignedIn, SignedOut, useSession } from '@clerk/nextjs';
import { withServerSideAuth } from '@clerk/nextjs/ssr';
import { motion } from 'framer-motion';
import { UserResource } from '@clerk/types';
import Link from 'next/link';
import { useState, FormEventHandler, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import bcrypt from 'bcryptjs';
import toast from 'react-hot-toast';
import reduceTitleLength from 'utils/reduceTitleLength';

// Custom types
interface Props {
  paste: PasteType & { longTitle: string };
  currentUser: 'Anonymous' | UserResource;
}

const MotionAlert = motion<AlertProps>(Alert);

// Paste component
const Paste = ({ paste, currentUser }: Props) => {
  const [isCorrectPassword, setIsCorrectPassword] = useState<boolean>(
    !paste.pastePassword
  );

  let metaTags = {
    title: paste.title || 'Untitled Paste',
    url: `https://${process.env.VERCEL_URL || 'easypastes.tk'}/pastes/${
      paste.pasteId
    }`,
    description: paste.description || ''
  };

  return (
    <Layout>
      <NextSeo
        title={metaTags.title}
        description={metaTags.description}
        openGraph={{
          title: metaTags.title,
          description: metaTags.description,
          url: metaTags.url
        }}
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

// Server side props override
export const getServerSideProps = withServerSideAuth(
  async context => {
    const paste = (context.params.paste as string[]).join('/');
    const { data: pastes, error } = await supabaseClient
      .from<PasteType>('Pastes')
      .select('*')
      .eq('pasteId', paste);

    if (error || pastes.length < 1) {
      console.log('NOT FOUND');
      return {
        notFound: true
      };
    }

    const currentPaste = reduceTitleLength(pastes[0]);

    if (!currentPaste.userId) {
      return {
        props: { paste: currentPaste, currentUser: 'Anonymous' }
      };
    }

    // Check if the current user is the paste owner
    const { userId } = context.auth;
    if (currentPaste.userId === userId) {
      return {
        props: {
          paste: currentPaste,
          currentUser: JSON.parse(JSON.stringify(context.user))
        }
      };
    }
  },
  { loadUser: true }
);

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
      <Tooltip hasArrow fontSize="sm" label={paste.longTitle}>
        <Heading
          textAlign="center"
          _selection={{ backgroundColor: 'purple.700' }}
          fontFamily="Poppins"
        >
          {paste.title ? paste.title : 'Untitled Paste'}
        </Heading>
      </Tooltip>
      <Center mt="3">
        {typeof currentUser !== 'string' ? (
          <>
            <Link href={`/user/pastes/${currentUser.id}`}>
              <a>
                <Tag size="lg" variant="subtle" colorScheme="purple">
                  {currentUser.profileImageUrl ? (
                    <Avatar
                      src={currentUser.profileImageUrl}
                      size="xs"
                      name={`${currentUser.firstName} ${currentUser.lastName}`}
                      ml={-1}
                      mr={2}
                    />
                  ) : (
                    <TagLeftIcon boxSize="16px" as={HiOutlineUser} />
                  )}

                  <TagLabel>
                    {`${currentUser.firstName} ${currentUser.lastName}`}
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
  const {
    // @ts-ignore
    session: { user }
  } = useSession();
  console.log(paste.userId);
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

  const togglePassword = () => setShow(!show);

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();

    const matches = bcrypt.compareSync(password, pastePwd);

    if (matches) setIsCorrectPassword(true);
    else {
      toast.error('Incorrect password', {
        style: {
          fontFamily: 'Poppins'
        }
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
