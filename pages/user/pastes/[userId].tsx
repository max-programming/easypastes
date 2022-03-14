import Link from 'next/link';

import {
  Alert,
  CloseButton,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useMediaQuery
} from '@chakra-ui/react';
import { SignedOut, WithUser } from '@clerk/nextjs';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import {
  HiOutlineEye,
  HiOutlineLink,
  HiOutlineLockClosed,
  HiOutlineViewList
} from 'react-icons/hi';
import useLocalStorage from 'use-local-storage';

import Paste from 'components/CodePastes/Paste';
import Layout from 'components/Layout';
import NoPastes from 'components/Pastes/NoPastes';

import reduceTitleLength from 'utils/reduceTitleLength';
import supabaseClient from 'utils/supabase';

import { PasteType, User } from 'types';

components / Pastes / Paste;

const links = [
  {
    url: '/',
    text: 'Home'
  },
  {
    url: '/pastes',
    text: 'Pastes'
  }
];

interface Props {
  pastes: (PasteType & {
    longTitle: string;
  })[];
  fullName: string;
  id: string;
  username: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  try {
    const { data: user } = await axios.get<User>(
      `https://api.clerk.dev/v1/users/${context.params?.userId}`,
      {
        headers: { Authorization: `Bearer ${process.env.CLERK_API_KEY}` }
      }
    );
    if (!user) {
      return {
        notFound: true
      };
    }
    const { data: pastes, error } = await supabaseClient
      .from<PasteType>('Pastes')
      .select(
        'id, title, language, userId, pasteId, description, public, private, createdAt'
      )
      // @ts-ignore
      .eq('userId', user.id)
      .order('createdAt', { ascending: false });

    const optimisedPastes = pastes.map(p => reduceTitleLength(p));

    return {
      props: {
        pastes: optimisedPastes,
        fullName: `${user.first_name} ${user.last_name}`,
        id: user.id,
        username: user.username
      }
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true
    };
  }
};

export default function MyPastes({ pastes, fullName, id, username }: Props) {
  const [showAlert, setShowAlert] = useLocalStorage('username-alert', false);
  const [matches] = useMediaQuery('(max-width: 768px)');
  return (
    <Layout>
      <NextSeo title={`${fullName} - Pastes`} />
      <Alert
        status="info"
        variant="left-accent"
        hidden={!showAlert || !!username}
        colorScheme="purple"
      >
        Add username in&nbsp;
        <Link href="/user" passHref>
          <Text as="a" _hover={{ color: 'purple.200' }}>
            the settings
          </Text>
        </Link>
        &nbsp;for your custom profile URL
        <CloseButton
          onClick={() => setShowAlert(false)}
          position="absolute"
          right="8px"
          top="8px"
          title="Remove alert"
        />
      </Alert>
      <Container maxW="3xl" my="6">
        <Heading
          textAlign="center"
          size="lg"
          _selection={{ backgroundColor: 'purple.700' }}
        >
          Pastes by {fullName}
        </Heading>
        {pastes.length === 0 ? (
          <NoPastes />
        ) : (
          <WithUser>
            {user =>
              user.id === id ? (
                <Tabs
                  isFitted
                  variant="solid-rounded"
                  colorScheme="purple"
                  mt="6"
                >
                  <TabList>
                    <Tab>
                      {matches ? (
                        <HiOutlineViewList />
                      ) : (
                        <>
                          <HiOutlineViewList /> &nbsp; All
                        </>
                      )}
                    </Tab>
                    <Tab>
                      {matches ? (
                        <HiOutlineEye />
                      ) : (
                        <>
                          <HiOutlineEye /> &nbsp; Public
                        </>
                      )}
                    </Tab>
                    <Tab>
                      {matches ? (
                        <HiOutlineLockClosed />
                      ) : (
                        <>
                          <HiOutlineLockClosed /> &nbsp; Private
                        </>
                      )}
                    </Tab>
                    <Tab>
                      {matches ? (
                        <HiOutlineLink />
                      ) : (
                        <>
                          <HiOutlineLink /> &nbsp; Unlisted
                        </>
                      )}
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      {pastes.map(paste => (
                        <Paste paste={paste} key={paste.id} />
                      ))}
                    </TabPanel>
                    <TabPanel>
                      {pastes.filter(p => p.public).length === 0 ? (
                        <NoPastes />
                      ) : (
                        pastes
                          .filter(p => p.public)
                          .map(paste => <Paste paste={paste} key={paste.id} />)
                      )}
                    </TabPanel>
                    <TabPanel>
                      {pastes.filter(p => p.private).length === 0 ? (
                        <NoPastes />
                      ) : (
                        pastes
                          .filter(p => p.private)
                          .map(paste => <Paste paste={paste} key={paste.id} />)
                      )}
                    </TabPanel>
                    <TabPanel>
                      {pastes.filter(p => !p.private && !p.public).length ===
                      0 ? (
                        <NoPastes />
                      ) : (
                        pastes
                          .filter(p => !p.private && !p.public)
                          .map(paste => <Paste paste={paste} key={paste.id} />)
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              ) : pastes.filter(p => p.public).length === 0 ? (
                <NoPastes />
              ) : (
                pastes
                  .filter(p => p.public)
                  .map(paste => (
                    <Paste
                      paste={paste}
                      key={paste.id}
                      isPassword={!!paste.pastePassword}
                    />
                  ))
              )
            }
          </WithUser>
        )}
        <SignedOut>
          {pastes.filter(p => p.public).length === 0 ? (
            <NoPastes />
          ) : (
            pastes
              .filter(p => p.public)
              .map(paste => (
                <Paste
                  paste={paste}
                  key={paste.id}
                  isPassword={!!paste.pastePassword}
                />
              ))
          )}
        </SignedOut>
      </Container>
    </Layout>
  );
}
