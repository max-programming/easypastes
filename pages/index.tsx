import {
  Button,
  Container,
  Input,
  Flex,
  InputGroup,
  InputLeftAddon,
  Box,
  Alert,
  CloseButton,
  useMediaQuery,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Textarea,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { BaseEmoji, Picker } from 'emoji-mart';
import { ILanguage } from 'types';
import axios from 'axios';

// Components imports
import InputCode from 'components/CodePastes/InputCode';
import SelectLanguage from 'components/CodePastes/SelectLanguage';
import PublicPastes from 'components/CodePastes/PublicPastes';
import Visibility from 'components/CodePastes/Visibility';
import Layout from 'components/Layout';
import useSWR from 'swr';
import useLocalStorage from 'use-local-storage';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import Link from 'next/link';
import { HiOutlineEmojiHappy, HiOutlineLockClosed } from 'react-icons/hi';
import PasswordModal from 'components/CodePastes/PasswordModal';
import fetcher from 'utils/fetcher';
import EmojiInput from 'components/CodePastes/EmojiInput';
import toast from 'react-hot-toast';

// Main pastes component
const Pastes = () => {
  const [matches] = useMediaQuery('(max-width:768px)');
  const { data, error } = useSWR('/api/pastes', fetcher);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState<string>(null);
  const [showAlert, setShowAlert] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUrlTaken, setIsUrlTaken] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useLocalStorage<ILanguage>(
    'language',
    'none'
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addEmoji = (emoji: BaseEmoji) => {
    setTitle(prevTitle => `${prevTitle}${emoji.native}`);
  };

  return (
    <>
      <Layout>
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

          <InputGroup position="relative">
            <EmojiInput
              placeholder="Title (optional)"
              value={title}
              setValue={setTitle}
              focusBorderColor="purple.200"
            />
            <InputRightElement>
              <IconButton
                aria-label="Search emoji"
                icon={<HiOutlineEmojiHappy />}
                variant="ghost"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
            </InputRightElement>
            {showEmojiPicker && (
              <Box position="absolute" right={0} top="120%" zIndex={4}>
                <Picker theme="dark" onSelect={addEmoji} native />
              </Box>
            )}
          </InputGroup>

          <Accordion allowToggle mt="3">
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Add Description (Optional)
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter Description here"
                  size="md"
                  focusBorderColor="purple.200"
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

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
              description={description}
              visibility={visibility}
              password={password}
              url={url}
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
              description={description}
              visibility={visibility}
              url={url}
              setIsUrlTaken={setIsUrlTaken}
            />
          </SignedOut>
          {error ? (
            <h2>{error}</h2>
          ) : (
            <PublicPastes publicPastes={data && data.pastes} />
          )}
        </Container>
      </Layout>
    </>
  );
};

interface ButtonProps {
  code: string;
  language: string;
  title: string;
  description: string;
  visibility: string;
  url: string;
  password?: string;
  setIsUrlTaken: Dispatch<SetStateAction<boolean>>;
}

// Sign in buttons
const SignedInButton = ({
  code,
  language,
  title,
  description,
  visibility,
  url,
  password,
  setIsUrlTaken
}: ButtonProps) => {
  // const session = useSession();
  const user = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // const sessionId = session?.id;

  const handleClick = async () => {
    if (code.trim() === '') {
      return toast.error('Code cannot be blank.', {
        style: {
          fontFamily: 'Poppins'
        }
      });
    }

    try {
      setLoading(true);

      const res = await axios.post(`/api/pastes/create`, {
        code,
        language,
        title,
        description,
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
        toast.error(error.response.data.message, {
          style: {
            fontFamily: 'Poppins'
          }
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
  description,
  visibility,
  url,
  setIsUrlTaken
}: ButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (code.trim() === '') {
      return toast.error('Code cannot be blank.', {
        style: {
          fontFamily: 'Poppins'
        }
      });
    }
    try {
      setLoading(true);

      const res = await axios.post(`/api/pastes/create`, {
        code,
        language,
        title,
        description,
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
        toast.error(error.response.data.message, {
          style: {
            fontFamily: 'Poppins'
          }
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

export default Pastes;
