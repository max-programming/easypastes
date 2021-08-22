// Packages
import Link from 'next/link';
import useLocalStorage from 'use-local-storage';
import {
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  CloseButton,
  Text,
  useMediaQuery
} from '@chakra-ui/react';
import { SignedOut, withUser, WithUser } from '@clerk/clerk-react';
import {
  HiOutlineViewList,
  HiOutlineEye,
  HiOutlineLockClosed,
  HiOutlineLink
} from 'react-icons/hi';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';

// Types
import type { UserResource } from '@clerk/types';
import { PasteType } from 'types';

// Custom files
import Layout from 'components/Layout';
import NoPastes from 'components/CodePastes/NoPastes';
import Paste from 'components/CodePastes/Paste';
import supabaseClient from 'utils/supabase';

interface Props {
  allPastes: PasteType[];
  user: UserResource;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { data: pastes, error } = await supabaseClient
    .from<PasteType>('Pastes')
    .select('*')
    // @ts-ignore
    .order('createdAt', { ascending: false });
  return {
    props: {
      allPastes: pastes
    }
  };
};

function MyPastes({ allPastes, user }: Props) {
  const [showAlert, setShowAlert] = useLocalStorage('username-alert', false);
  const [matches] = useMediaQuery('(max-width: 768px)');

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
            Add username in{' '}
            <Link href="/user" passHref>
              <Text as="a" _hover={{ color: 'purple.200' }}>
                the settings
              </Text>
            </Link>{' '}
            for your custom profile URL
            <CloseButton
              onClick={() => setShowAlert(false)}
              position="absolute"
              right="8px"
              top="8px"
              title="Remove alert"
            />
          </Alert>
          <Container maxW="3xl" mt="6">
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
                        <HiOutlineViewList /> All
                      </>
                    )}
                  </Tab>
                  <Tab>
                    {matches ? (
                      <HiOutlineEye />
                    ) : (
                      <>
                        <HiOutlineEye /> Public
                      </>
                    )}
                  </Tab>
                  <Tab>
                    {matches ? (
                      <HiOutlineLockClosed />
                    ) : (
                      <>
                        <HiOutlineLockClosed /> Private
                      </>
                    )}
                  </Tab>
                  <Tab>
                    {matches ? (
                      <HiOutlineLink />
                    ) : (
                      <>
                        <HiOutlineLink /> Unlisted
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

export default withUser(MyPastes);
