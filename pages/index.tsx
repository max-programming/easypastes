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
  CloseButton,
  useMediaQuery,
  UseToastOptions,
  useDisclosure
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
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
import { SignedIn, SignedOut, useSession, useUser } from '@clerk/clerk-react';
import Link from 'next/link';
import { HiLockClosed, HiOutlineLockClosed } from 'react-icons/hi';
import PasswordModal from 'components/CodePastes/PasswordModal';

const links = [
  {
    url: '/',
    text: 'Home'
  }
];

interface ButtonProps {
  code: string;
  language: string;
  title: string;
  visibility: string;
  url: string;
  password?: string;
  toast: (options?: UseToastOptions) => string | number;
  setIsUrlTaken: Dispatch<SetStateAction<boolean>>;
}

// Sign in buttons
const SignedInButton = ({
  code,
  language,
  title,
  visibility,
  url,
  password,
  toast,
  setIsUrlTaken
}: ButtonProps) => {
  // const session = useSession();
  const user = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // const sessionId = session?.id;
  const handleClick = async () => {
    if (code.trim() === '') {
      return toast({
        title: "Code can't be blank.",
        status: 'error',
        isClosable: true,
        position: 'top-right'
      });
    }
    try {
      setLoading(true);

      const res = await axios.post(`/api/pastes/create`, {
        code,
        language,
        title,
        _public: visibility === 'public',
        _private: visibility === 'private',
        userId: user.id,
        pasteId: url,
        pastePassword: password
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
          isClosable: true,
          position: 'top-right'
        });
      }
    }
  };
  return (
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
  );
};

const SignedOutButton = ({
  code,
  language,
  title,
  visibility,
  url,
  toast,
  setIsUrlTaken
}: ButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (code.trim() === '') {
      return toast({
        title: "Code can't be blank.",
        status: 'error',
        isClosable: true,
        position: 'top-right'
      });
    }
    try {
      setLoading(true);

      const res = await axios.post(`/api/pastes/create`, {
        code,
        language,
        title,
        _public: visibility === 'public',
        _private: visibility === 'private',
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
          isClosable: true,
          position: 'top-right'
        });
      }
    }
  };
  return (
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
  );
};

// Main pastes component
const Pastes = () => {
  const toast = useToast();
  const [matches] = useMediaQuery('(max-width:768px)');
  const { data, error } = useSWR('/api/pastes');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState<string>(null);
  const [showAlert, setShowAlert] = useState(true);
  const [isUrlTaken, setIsUrlTaken] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useLocalStorage<ILanguage>(
    'language',
    'none'
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          <SelectLanguage language={language} setLanguage={setLanguage} />

          <Input
            placeholder="Title (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            focusBorderColor={useColorModeValue(
              theme.colors.purple[600],
              theme.colors.purple[200]
            )}
          />

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
              {/* Visibility */}
              <label style={{ marginRight: 8 }}>Visibility: </label>
              <Visibility
                visibility={visibility}
                setVisibility={setVisibility}
              />
            </Flex>
          </Flex>

          {/* Code for the paste */}
          <InputCode code={code} setCode={setCode} language={language} />

          {/* Creating button */}
          <SignedIn>
            <SignedInButton
              code={code}
              language={language}
              title={title}
              visibility={visibility}
              password={password}
              url={url}
              toast={toast}
              setIsUrlTaken={setIsUrlTaken}
            />
            <Button
              leftIcon={<HiOutlineLockClosed />}
              colorScheme="purple"
              variant="outline"
              float="right"
              mt="4"
              mr="3"
              onClick={onOpen}
            >
              Set password
            </Button>
            <PasswordModal
              password={password}
              setPassword={setPassword}
              isOpen={isOpen}
              onClose={onClose}
            />
          </SignedIn>
          <SignedOut>
            <SignedOutButton
              code={code}
              language={language}
              title={title}
              visibility={visibility}
              url={url}
              toast={toast}
              setIsUrlTaken={setIsUrlTaken}
            />
          </SignedOut>
          <PublicPastes publicPastes={data && data.pastes} />
        </Container>
      </Layout>
    </>
  );
};

export default Pastes;
