import { Container } from '@chakra-ui/layout';
import { UserProfile } from '@clerk/nextjs';
import { NextSeo } from 'next-seo';

import Layout from 'components/Layout';

export default function UserProfilePage() {
  return (
    <Layout>
      <NextSeo title="User Profile" />
      <Container mt="10" maxW="full" maxH="full">
        <UserProfile path="/user" routing="path" />
      </Container>
    </Layout>
  );
}
