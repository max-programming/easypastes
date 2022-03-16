import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  Box,
  Button,
  CloseButton,
  Container,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Textarea,
  Tooltip,
  useDisclosure,
  useMediaQuery
} from '@chakra-ui/react';
import { SignedIn, SignedOut, useAuth } from '@clerk/nextjs';
import { BaseEmoji, Picker } from 'emoji-mart';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { HiOutlineEmojiHappy, HiOutlineLockClosed } from 'react-icons/hi';
import useSWR from 'swr';
import useLocalStorage from 'use-local-storage';

import supabaseClient from 'lib/supabase';

import InputCode from 'components/Code/InputCode';
import EmojiInput from 'components/Emoji/EmojiInput';
import Layout from 'components/Layout';
import SelectLanguage from 'components/Others/SelectLanguage';
import Visibility from 'components/Others/Visibility';

import fetcher from 'utils/fetcher';
import filterBadWords from 'utils/filterBadWords';
import { generateNanoid } from 'utils/generateId';

import { ILanguage, PasteType } from 'types';

// Load the public pastes dynamically
const PublicPastesDynamic = dynamic(
  () => import('sections/Public/PublicPastes')
);

const PasswordModalDynamic = dynamic(
  () => import('components/Modal/PasswordModal')
);

const Pastes = () => {
  // States
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [url, setUrl] = useState<string>(null);
  const [isUrlTaken, setIsUrlTaken] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Media queries
  const [matches] = useMediaQuery('(max-width:768px)');

  // Fetch API
  const { data, error } = useSWR('/api/pastes', fetcher);

  // Fetch last language
  const [language, setLanguage] = useLocalStorage<ILanguage>(
    'language',
    'none'
  );

  // Modal
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
            </Link>{' '}
            to customize the URL of your paste
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
              <Tooltip label="Search emoji" hasArrow fontSize="sm">
                <IconButton
                  aria-label="Search emoji"
                  icon={<HiOutlineEmojiHappy />}
                  variant="ghost"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
              </Tooltip>
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
              <label style={{ marginRight: 8 }}>Visibility: </label>
              <Visibility
                visibility={visibility}
                setVisibility={setVisibility}
              />
            </Flex>
          </Flex>

          <InputCode code={code} setCode={setCode} language={language} />

          <SignedIn>
            <SignedInButton
              code={code}
              language={language}
              title={title}
              description={description}
              visibility={visibility}
              password={password}
              url={url ?? generateNanoid()}
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
            <PasswordModalDynamic
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
            <PublicPastesDynamic publicPastes={data && data.pastes} />
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
  const router = useRouter();
  const { getToken, userId } = useAuth();
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
      const token = await getToken({ template: 'supabase' });
      supabaseClient.auth.setAuth(token);
      let { data, error } = await supabaseClient
        .from<PasteType>('Pastes')
        .insert([
          {
            title: filterBadWords(title),
            description: filterBadWords(description),
            language: language as ILanguage,
            pasteId: url,
            public: visibility === 'public',
            private: visibility === 'private',
            pastePassword: password,
            userId,
            code
          }
        ]);
      console.log({ addedItem: data });

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

      let { data, error } = await supabaseClient
        .from<PasteType>('Pastes')
        .insert([
          {
            title: filterBadWords(title),
            description: filterBadWords(description),
            language: language as ILanguage,
            pasteId: generateNanoid(),
            public: visibility === 'public',
            code
          }
        ]);

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
