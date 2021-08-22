// Packages
import { Center, Heading } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { FcNoIdea } from 'react-icons/fc';

// Custom files
import Layout from 'components/Layout';

export default function Offline() {
  return (
    <Layout>
      <NextSeo title="You are offline" />
      <Center my="32" flexDir="column">
        <FcNoIdea size="5rem" />
        <Heading fontFamily="Poppins" size="lg" mt="4">
          You are offline. Please connect to the internet.
        </Heading>
      </Center>
    </Layout>
  );
}
