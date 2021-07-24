import { SignUp } from '@clerk/clerk-react';
import { Container } from '@chakra-ui/layout';
import Layout from 'components/Layout';

export default function SignUpPage() {
  return (
    <Layout title="Sign up">
      <Container mt="10">
        <SignUp path="/sign-up" routing="path" />
      </Container>
    </Layout>
  );
}
