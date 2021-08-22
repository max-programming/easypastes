// Packages
import { Container } from '@chakra-ui/layout';
import { SignUp } from '@clerk/clerk-react';
import { NextSeo } from 'next-seo';

// Custom files
import Layout from 'components/Layout';

export default function SignUpPage() {
  return (
    <Layout>
      <NextSeo title="Sign up" />
      <Container mt="10">
        <SignUp path="/sign-up" routing="path" />
      </Container>
    </Layout>
  );
}
