// Own imports
import Layout from 'components/Layout';
import supabaseClient from 'utils/supabase';

// Other imports
import {
  Alert,
  AlertProps,
  Container,
  Heading,
  Button,
  Center,
  Input
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { PasteType, User } from 'types';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import InputCode from 'components/CodePastes/InputCode';
import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import SelectLanguage from 'components/CodePastes/SelectLanguage';
import { useRouter } from 'next/router';
import Visibility from 'components/CodePastes/Visibility';
import axios from 'axios';

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
}

const MotionAlert = motion<AlertProps>(Alert);

// Server side props override
export const getServerSideProps: GetServerSideProps = async context => {
  // @ts-ignore
  const { paste } = context.params;
  const { data: pastes, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .select('*')
    // @ts-ignore
    .eq('pasteId', paste);

  console.error(error);

  if (error)
    return {
      notFound: true
    };
  return {
    props: { paste: pastes[0] }
  };
};

const InfoAlert = () => (
  <MotionAlert
    variant="left-accent"
    status="error"
    initial={{ translateY: -75 }}
    animate={{ translateY: 0 }}
  >
    You can&apos;t edit this paste.
  </MotionAlert>
);

const EditPaste = ({ paste }: { paste: PasteType }) => {
  const user = useUser();
  const [title, setTitle] = useState(paste.title);
  const [code, setCode] = useState(paste.code);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(paste.language);
  const [visibility, setVisibility] = useState(
    paste.public ? 'public' : paste.private ? 'private' : 'unlisted'
  );
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    const {
      data: { data, error }
    } = await axios.post('/api/pastes/update', {
      code,
      language,
      title,
      pasteId: paste.pasteId,
      userId: paste.userId,
      _public: visibility === 'public',
      _private: visibility === 'private'
    });
    if (!error) {
      await router.push(`/pastes/${paste.pasteId}`);
      setLoading(false);
    }
  };
  return (
    <>
      <Input value={title} onChange={e => setTitle(e.target.value)} mb="5" />
      <SelectLanguage language={language} setLanguage={setLanguage} />
      <Center>
        <Visibility visibility={visibility} setVisibility={setVisibility} />
      </Center>
      <InputCode code={code} setCode={setCode} language={language} />
      <Button
        fontWeight="normal"
        my="4"
        colorScheme="purple"
        float="right"
        rightIcon={<FiArrowRight />}
        onClick={handleClick}
        isLoading={loading}
        spinnerPlacement="end"
        loadingText="Saving"
      >
        Save
      </Button>
    </>
  );
};

// Paste component
const Paste = ({ paste }: Props) => {
  return (
    <Layout title={paste.title || 'Paste'} links={links}>
      <Container maxW="full" my="6">
        <>
          <SignedIn>
            <EditPaste paste={paste} />
          </SignedIn>
          <SignedOut>
            <InfoAlert />
          </SignedOut>
        </>
      </Container>
    </Layout>
  );
};

export default Paste;
