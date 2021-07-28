import { Center, Heading, Text } from '@chakra-ui/react';
import Layout from 'components/Layout';
import { FcNook } from 'react-icons/fc';
import Link from 'next/link';

export default function Offline() {
  return (
    <Layout title="404: Page not found">
      <Center my="52" flexDir="column">
        <FcNook size="5rem" />
        <Heading fontFamily="Poppins" mt="4">
          404 Page not found, return{' '}
          <Link href="/" passHref>
            <Text as="a" textDecor="underline" _hover={{ color: 'purple.300' }}>
              home.
            </Text>
          </Link>
        </Heading>
      </Center>
    </Layout>
  );
}
