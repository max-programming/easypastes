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
import { SignedOut, WithUser, withUser } from '@clerk/nextjs';
import { UserResource } from '@clerk/types';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import {
  HiOutlineEye,
  HiOutlineLink,
  HiOutlineLockClosed,
  HiOutlineViewList
} from 'react-icons/hi';
import useLocalStorage from 'use-local-storage';

import NoPastes from 'components/CodePastes/NoPastes';
import Paste from 'components/CodePastes/Paste';
import Layout from 'components/Layout';

import reduceTitleLength from 'utils/reduceTitleLength';
import supabaseClient from 'utils/supabase';

import { PasteType, User } from 'types';

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
  allPastes: (PasteType & {
    longTitle: string;
  })[];
  user: UserResource;
}

function MyPastes({ allPastes, user }: Props) {
  const [showAlert, setShowAlert] = useLocalStorage('username-alert', false);
  const [matches] = useMediaQuery('(max-width: 768px)');
  // const user = useUser();
  const pastes = allPastes.filter(paste => paste.userId === user.id);
  return (
    <WithUser>
      {user => (
        <Layout>
          <NextSeo title={`${user.firstName} ${user.lastName} - Pastes`} />
          <Alert
            status="info"
            variant="left-accent"
            hidden={!showAlert || !!user.username}
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
              fontFamily="Poppins"
            >
              Pastes by {`${user.firstName} ${user.lastName}`}
            </Heading>
            {pastes.length === 0 ? (
              <NoPastes />
            ) : (
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
            )}
            <SignedOut>
              {pastes
                .filter(p => p.public)
                .map(paste => (
                  <Paste paste={paste} key={paste.id} />
                ))}
            </SignedOut>
          </Container>
        </Layout>
      )}
    </WithUser>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { data: pastes, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .select(
      'id, title, language, userId, pasteId, description, public, private, createdAt'
    )
    // @ts-ignore
    .order('createdAt', { ascending: false });

  const allPastes = pastes.map(p => reduceTitleLength(p));

  return {
    props: {
      allPastes
    }
  };
};

export default withUser(MyPastes);
