import dynamic from 'next/dynamic';
import Link from 'next/link';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  Box,
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
  useMediaQuery
} from '@chakra-ui/react';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { BaseEmoji, Picker } from 'emoji-mart';
import { useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import useSWR from 'swr';
import useLocalStorage from 'use-local-storage';

import PasteSettings from 'sections/Home/PasteSettings';
import SignedInHome from 'sections/Home/SignedInHome';
import SignedOutHome from 'sections/Home/SignedOutHome';

import InputCode from 'components/Code/InputCode';
import EmojiInput from 'components/Emoji/EmojiInput';
import Layout from 'components/Layout';
import SelectLanguage from 'components/Others/SelectLanguage';
import Visibility from 'components/Others/Visibility';

import fetcher from 'utils/fetcher';

import { ILanguage } from 'types';

// Load the public pastes dynamically
const PublicPastesDynamic = dynamic(
  () => import('sections/Public/PublicPastes')
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

          <PasteSettings
            {...{ matches, isUrlTaken, url, visibility, setUrl, setVisibility }}
          />

          <InputCode code={code} setCode={setCode} language={language} />

          <SignedIn>
            <SignedInHome
              {...{
                code,
                description,
                language,
                password,
                setIsUrlTaken,
                setPassword,
                title,
                url,
                visibility
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignedOutHome
              {...{
                title,
                code,
                description,
                visibility,
                language,
                setIsUrlTaken
              }}
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

export default Pastes;
