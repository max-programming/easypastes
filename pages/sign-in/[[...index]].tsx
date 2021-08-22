// Packages
import { Container } from '@chakra-ui/layout';
import { SignIn } from '@clerk/clerk-react';
import { NextSeo } from 'next-seo';

// Custom files
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
