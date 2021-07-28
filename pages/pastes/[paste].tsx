// Own imports
import Layout from 'components/Layout';
import DisplayCode from 'components/CodePastes/DisplayCode';
import supabaseClient from 'utils/supabase';

// Other imports
import { Alert, AlertProps, Container, Heading } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { PasteType, User } from 'types';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';

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

const PrivatePaste = ({ paste, currentUser }: Props) => {
  const user = useUser();

  return user.id !== paste.userId ? (
    <InfoAlert />
  ) : (
    <>
      {paste.title !== '' && (
        <Heading
          textAlign="center"
          _selection={{ backgroundColor: 'purple.700' }}
        >
          {paste.title}
        </Heading>
      )}
      {typeof currentUser !== 'string' && (
        <Heading
          textAlign="center"
          size="md"
          mt="2"
          _selection={{ backgroundColor: 'purple.700' }}
        >
          By&nbsp;
          <Link href={`/user/pastes/${currentUser.id}`}>
            <a>{`${currentUser.first_name} ${currentUser.last_name}`}</a>
          </Link>
        </Heading>
      )}
      <DisplayCode paste={paste} language={paste.language} />
    </>
  );
};

// Paste component
const Paste = ({ paste, currentUser }: Props) => {
  return (
    <Layout title={paste.title || 'Paste'} links={links}>
      <Container maxW="6xl" my="6">
        {paste.private ? (
          <>
            <SignedIn>
              <PrivatePaste paste={paste} currentUser={currentUser} />
            </SignedIn>
            <SignedOut>
              <InfoAlert />
            </SignedOut>
          </>
        ) : (
          <>
            <Heading
              textAlign="center"
              _selection={{ backgroundColor: 'purple.700' }}
            >
              {paste.title ? paste.title : 'Untitled Paste'}
            </Heading>
            <Heading
              textAlign="center"
              size="md"
              mt="2"
              _selection={{ backgroundColor: 'purple.700' }}
            >
              By&nbsp;
              {typeof currentUser !== 'string' ? (
                <Link href={`/user/pastes/${currentUser.id}`}>
                  <a>{`${currentUser.first_name} ${currentUser.last_name}`}</a>
                </Link>
              ) : (
                currentUser
              )}
            </Heading>
            <DisplayCode paste={paste} language={paste.language} />
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Paste;
