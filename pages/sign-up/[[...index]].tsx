import { SignUp } from '@clerk/nextjs';
import { Container } from '@chakra-ui/layout';
import Layout from 'components/Layout';
import { NextSeo } from 'next-seo';

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
