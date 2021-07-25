import {
  Button,
  Container,
  Input,
  useColorModeValue,
  theme,
  Flex,
  InputGroup,
  InputLeftAddon,
  Box,
  useToast,
  Alert,
  CloseButton
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { ILanguage, PasteType } from 'types';
import axios from 'axios';

// Components imports
import InputCode from 'components/CodePastes/InputCode';
import SelectLanguage from 'components/CodePastes/SelectLanguage';
import PublicPastes from 'components/CodePastes/PublicPastes';
import Visibility from 'components/CodePastes/Visibility';
import Layout from 'components/Layout';
import useSWR from 'swr';
import useLocalStorage from 'use-local-storage';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Link from 'next/link';

const links = [
  {
    url: '/',
    text: 'Home'
  }
];

export default function Pastes() {
  const toast = useToast();
  const { data, error } = useSWR('/api/pastes');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [isUrlTaken, setIsUrlTaken] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const [language, setLanguage] = useLocalStorage<ILanguage>(
    'language',
    'none'
  );
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleClick = async () => {
    if (code.trim() === '') return;
    try {
      setLoading(true);

      const res = await axios.post('/api/pastes/create', {
        code,
        language,
        title,
        _public: visibility === 'public',
        _private: visibility === 'private',
        userId: window.Clerk?.user?.id,
        pasteId: url
      });

      const { data, error } = res.data;

      if (data) {
        await router.push(`/pastes/${data[0].pasteId}`);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 400) {
        setIsUrlTaken(true);
        toast({
          title: error.response.data.message,
          status: 'error',
          isClosable: true
        });
      }
    }
  };

  return (
    <>
      <Layout links={links}>
        <SignedOut>
          <Alert
            status="info"
            variant="left-accent"
            hidden={!showAlert}
            colorScheme="purple"
          >
            <FiAlertCircle style={{ marginRight: 5 }} />
            <Link href="/sign-in">
              <a>Sign in</a>
            </Link>
            &nbsp;to customize the URL of your paste
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => setShowAlert(false)}
            />
          </Alert>
        </SignedOut>
        <Container maxW="container.xl" my="6">
          {/* Selecting the paste lang */}
          <SelectLanguage language={language} setLanguage={setLanguage} />

          {/* Setting the title */}
          <Input
            placeholder="Title (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            focusBorderColor={useColorModeValue(
              theme.colors.purple[600],
              theme.colors.purple[200]
            )}
          />

          <Flex align="center" justify="center" mt="4">
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
            <Flex justify="center" align="center" my="3" flex="1">
              <label style={{ marginRight: 8 }}>Visibility: </label>
              <Visibility
                visibility={visibility}
                setVisibility={setVisibility}
              />
            </Flex>
          </Flex>

          {/* Visibility */}

          {/* Code for the paste */}
          <InputCode code={code} setCode={setCode} language={language} />

          {/* Creating button */}
          <Button
            fontWeight="normal"
            my="4"
            colorScheme="purple"
            float="right"
            rightIcon={<FiArrowRight />}
            onClick={handleClick}
            isLoading={loading}
            spinnerPlacement="end"
            loadingText="Creating"
          >
            Create
          </Button>
          <PublicPastes publicPastes={data} />
        </Container>
      </Layout>
    </>
  );
}
