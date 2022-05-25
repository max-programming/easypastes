import { Container } from '@chakra-ui/react';
import { SignIn } from '@clerk/nextjs';
import { NextSeo } from 'next-seo';

import Layout from 'components/Layout';

export default function SignInPage() {
  return (
    <Layout>
      <NextSeo title="Sign in" />
      <Container mt="10">
        <SignIn path="/sign-in" routing="path" />
      </Container>
    </Layout>
  );
}
